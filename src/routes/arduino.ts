import express from "express";
import * as arduinoHandler from "../arduino";

const router = express.Router();

router.get("/data", (_, res) => {
	const data = arduinoHandler.getLatestData();
	const statusInfo = arduinoHandler.getConnectionStatus();

	if (!statusInfo.connected) {
		return res.json({
			...statusInfo,
			lastUpdate: new Date().toISOString(),
			data: null,
			message: "Podłącz arduino",
		});
	}

	if (data === null) {
		return res.json({
			...statusInfo,
			lastUpdate: new Date().toISOString(),
			data: null,
			message: "Oczekiwanie na dane z Arduino...",
		});
	}

	res.json({
		...statusInfo,
		lastUpdate: new Date().toISOString(),
		data: data,
		message: null,
	});
});

router.get("/status", (_, res) => {
	const statusInfo = arduinoHandler.getConnectionStatus();

	res.json({
		...statusInfo,
		timestamp: new Date().toISOString(),
		message: statusInfo.connected ? null : "Podłącz arduino",
	});
});

router.post("/command", async (req, res) => {
	const { command } = req.body;

	if (!command) {
		return res.status(400).json({
			success: false,
			message: "Brak komendy",
		});
	}

	const statusInfo = arduinoHandler.getConnectionStatus();

	if (!statusInfo.connected) {
		return res.json({
			success: false,
			message: "Podłącz arduino",
			timestamp: new Date().toISOString(),
		});
	}

	try {
		await arduinoHandler.sendCommand(command);
		res.json({
			success: true,
			message: "Komenda wysłana pomyślnie",
			timestamp: new Date().toISOString(),
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message:
				err instanceof Error ? err.message : "Błąd podczas wysyłania komendy",
			timestamp: new Date().toISOString(),
		});
	}
});

export { router as arduinoRouter };
