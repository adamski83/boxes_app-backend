import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as arduinoHandler from "./arduino";

import { boxRouter } from "./routes/box";
import { userRouter } from "./routes/user";
import { pdfRouter } from "./routes/pdf";
// import { arduinoRouter } from "./routes/arduino";

const corsOptions = {
	origin: ["http://localhost:5173", "http://localhost:3000"],
	httpOnly: true,
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

mongoose
	.connect(process.env.MONGODB_CONNECTION_STRING as string, {
		serverSelectionTimeoutMS: 5000,
	})
	.then(() => console.log("✅ Połączono z bazą danych MongoDB"))
	.catch((error) => {
		console.error("❌ Błąd połączenia z bazą danych:", error);
		process.exit(1);
	});

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/pdfs", express.static(path.join(__dirname, "pdfs")));

app.use((req, res, next) => {
	console.log(`${req.method} ${req.path}`);
	next();
});

app.use("/user", userRouter);
app.use("/api", boxRouter);
app.use("/api", pdfRouter);
// try {
// 	app.use("/arduino", arduinoRouter);
// } catch (error) {
// 	console.error("Nie można zainicjalizować Arduino:", error);

// 	const fallbackRouter = express.Router();
// 	fallbackRouter.all("*", (req, res) => {
// 		res.json({
// 			connected: false,
// 			message: "Podłącz arduino",
// 			lastUpdate: new Date().toISOString(),
// 			data: null,
// 		});
// 	});

// 	app.use("/arduino", fallbackRouter);
// }
app.use(
	(
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.error("Błąd serwera:", err);
		res.status(500).json({
			success: false,
			message: "Wewnętrzny błąd serwera",
			error: process.env.NODE_ENV === "development" ? err.message : undefined,
		});
	}
);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
	console.log(`🚀 Serwer działa na http://localhost:${PORT}`);
	console.log(`📁 Statyczne pliki uploads: http://localhost:${PORT}/uploads`);
	console.log(`📄 Statyczne pliki PDF: http://localhost:${PORT}/pdfs`);
});
