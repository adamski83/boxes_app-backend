"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const box_1 = require("./routes/box");
const user_1 = require("./routes/user");
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
mongoose_1.default
    .connect(process.env.MONGODB_CONNECTION_STRING, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => console.log("connected to DB"))
    .catch((error) => console.log(error));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/user", user_1.userRouter);
app.use("/api", box_1.boxRouter);
app.listen(5000, () => {
    console.log(`app is running on http://localhost:5000`);
});
