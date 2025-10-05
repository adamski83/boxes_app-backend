import { isValidObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";

export const validateObjectId = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id = req.params._id;
	if (!isValidObjectId(id)) {
		return res.status(400).json({
			success: false,
			message: "Nieprawidłowy format ID",
		});
	}
	next();
};
