import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";

import { boxRouter } from "./routes/box";
import { userRouter } from "./routes/user";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(`${process.env.DB_URL}`).catch((error) => console.log(error));
app.use("/user", userRouter);
app.use("/api", boxRouter);

app.listen(5000, () => {
	console.log(`app is running on http://localhost:5000`);
});
