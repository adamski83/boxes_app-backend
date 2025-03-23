import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser, UserModel } from "../schema/user";
import { UserErrors } from "../errors";
const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
	const { username, password } = req.body;

	try {
		const user = await UserModel.findOne({ username });
		if (user) {
			return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXIST });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new UserModel({
			username,
			password: hashedPassword,
			role: "user",
		});
		await newUser.save();
		res.status(201).json({ message: "User registered successfully" });
	} catch (err) {
		res.status(500).json({ type: err });
	}
});

router.post("/login", async (req: Request, res: Response) => {
	const { username, password } = req.body;

	try {
		const user: IUser | null = await UserModel.findOne({ username });

		if (!user) {
			return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
		}
		const token = jwt.sign({ id: user._id, role: user.role }, "secret");

		res.status(200).json({
			token,
			user: {
				id: user._id,
				username: user.username,
				role: user.role,
			},
		});
	} catch (err) {
		res.status(500).json({ type: err });
	}
});

export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, "secret", (err) => {
			if (err) {
				console.error("JWT Verification Error:", err);
				return res.sendStatus(403);
			}
			next();
		});
	} else {
		res.sendStatus(401);
	}
};

export { router as userRouter };
