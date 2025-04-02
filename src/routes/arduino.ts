import express from "express";
import * as arduinoHandler from "../arduino";

const router = express.Router();

router.get("/data", (_, res) => {
	const data = arduinoHandler.getLatestData();
	const statusInfo = arduinoHandler.getConnectionStatus();

	if (data === null) {
		return res.status(404).json({
			success: false,
			message: "Brak danych z Arduino",
			lastUpdate: new Date().toISOString(),
		});
	}

	res.json({
		...statusInfo,
		lastUpdate: new Date().toISOString(),
		data: data,
	});
});

router.get("/status", (req, res) => {
	const statusInfo = arduinoHandler.getConnectionStatus();

	res.json({
		...statusInfo,
		timestamp: new Date().toISOString(),
	});
});

router.post("/command", async (req, res) => {
	try {
		const { command } = req.body;

		if (!command) {
			return res.status(400).json({
				success: false,
				message: "Brak komendy w zapytaniu",
			});
		}

		await arduinoHandler.sendCommand(command);
		res.json({
			success: true,
			message: "Komenda wysłana pomyślnie",
			command,
			timestamp: new Date().toISOString(),
		});
	} catch (error: unknown) {
		console.error("Błąd wysyłania komendy do Arduino:", error);
		res.status(500).json({
			success: false,
			message:
				error instanceof Error ? error.message : "Błąd wysyłania komendy",
			timestamp: new Date().toISOString(),
		});
	}
});

export { router as arduinoRouter };
