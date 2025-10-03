import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { EventEmitter } from "events";
import { Server } from "http";
import { Server as SocketServer } from "socket.io";

process.on("unhandledRejection", (reason, promise) => {
	console.error("Nieobsłużona obietnica rejection:", reason);
});

process.on("uncaughtException", (error) => {
	console.error("Nieobsłużony wyjątek:", error);
});

const arduinoEvents = new EventEmitter();

const port = new SerialPort({
	path: process.env.ARDUINO_PORT || "COM4",
	baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

let isConnected: boolean = false;
let latestData: any = null;
let connectionError: Error | null = null;

port.on("open", () => {
	console.log("Połączono z Arduino na porcie", port.path);
	isConnected = true;
	connectionError = null;
	arduinoEvents.emit("connection", { status: "connected", port: port.path });
});

port.on("error", (err) => {
	console.error("Błąd połączenia z Arduino:", err.message);
	isConnected = false;
	connectionError = err;
	arduinoEvents.emit("error", { status: "error", message: err.message });
});

port.on("close", () => {
	console.log("Połączenie z Arduino zostało zamknięte");
	isConnected = false;
	arduinoEvents.emit("connection", { status: "disconnected" });

	setTimeout(() => {
		console.log("Próba ponownego połączenia z Arduino...");
		port.open((err) => {
			if (err) {
				console.error("Nie udało się ponownie połączyć:", err.message);
			}
		});
	}, 5000);
});

parser.on("data", (data: string) => {
	try {
		latestData = JSON.parse(data.trim());
		console.log("Otrzymano dane z Arduino:", latestData);
		arduinoEvents.emit("data", latestData);
	} catch (e) {
		console.log("Otrzymano dane z Arduino (tekst):", data);
		latestData = { raw: data, timestamp: new Date().toISOString() };
		arduinoEvents.emit("data", latestData);
	}
});

export const getLatestData = () => {
	return latestData;
};

export const getIsConnected = () => {
	return isConnected;
};

export const getConnectionStatus = () => {
	return {
		connected: isConnected,
		port: port.path,
		error: connectionError ? connectionError.message : null,
	};
};

export const sendCommand = async (command: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		if (!isConnected) {
			reject(new Error("Arduino nie jest podłączone"));
			return;
		}

		port.write(`${command}\n`, (err) => {
			if (err) {
				console.error("Błąd wysyłania komendy:", err.message);
				reject(err);
			} else {
				console.log(`Wysłano komendę do Arduino: ${command}`);
				resolve(true);
			}
		});
	});
};

export const setupWebSocket = (server: Server) => {
	const io = new SocketServer(server, {
		cors: {
			origin: process.env.FRONTEND_URL || "http://localhost:5173",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log("Klient WebSocket podłączony");
		socket.emit("arduino-status", getConnectionStatus());

		if (latestData) {
			socket.emit("arduino-data", latestData);
		}
		const dataHandler = (data: any) => {
			socket.emit("arduino-data", data);
		};

		const statusHandler = (status: any) => {
			socket.emit("arduino-status", status);
		};

		arduinoEvents.on("data", dataHandler);
		arduinoEvents.on("connection", statusHandler);
		arduinoEvents.on("error", statusHandler);

		socket.on("command", async (command: string) => {
			try {
				await sendCommand(command);
				socket.emit("command-response", {
					success: true,
					command,
					timestamp: new Date().toISOString(),
				});
			} catch (err) {
				socket.emit("command-response", {
					success: false,
					command,
					error: err instanceof Error ? err.message : "Nieznany błąd",
					timestamp: new Date().toISOString(),
				});
			}
		});

		socket.on("disconnect", () => {
			console.log("Klient WebSocket rozłączony");
			arduinoEvents.off("data", dataHandler);
			arduinoEvents.off("connection", statusHandler);
			arduinoEvents.off("error", statusHandler);
		});
	});

	return io;
};

export const subscribe = (event: string, callback: (data: any) => void) => {
	arduinoEvents.on(event, callback);
	return () => arduinoEvents.off(event, callback);
};
