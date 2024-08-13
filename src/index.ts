import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import { boxRouter } from "./routes/box";
import { userRouter } from "./routes/user";

const corsOptions = {
	origin: "http://localhost:5173",
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};
mongoose.connect(`${process.env.DB_URL}`).catch((error) => console.log(error));

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/api", boxRouter);

app.listen(5000, () => {
	console.log(`app is running on http://localhost:5000`);
});
