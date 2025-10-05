import { Request, Response } from "express";
import { validateObjectId } from "../middleware/validateObjectId";
import { verifyToken } from "../middleware/verifyToken";
import Boxes from "../schema/box";

export const getBoxByIdMiddleware = [verifyToken, validateObjectId];

export const getBoxById = async (req: Request, res: Response) => {
	const { _id } = req.params;

	try {
		const box = await Boxes.findById(_id);
		if (!box) {
			return res.status(404).json({
				success: false,
				message: "Box not found",
			});
		}

		return res.status(200).json({
			success: true,
			data: box,
		});
	} catch (error) {
		console.error(`Błąd podczas pobierania boxa ${_id}:`, error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
