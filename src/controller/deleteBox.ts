import { Request, Response } from "express";

import Boxes from "../schema/box";
import { verifyToken } from "../middleware/verifyToken";
import { requireAdmin } from "../middleware/requireAdmin";
import { validateObjectId } from "../middleware/validateObjectId";

export const deleteBox = [
	verifyToken,
	validateObjectId,
	requireAdmin,

	async (req: Request, res: Response) => {
		const { _id } = req.params;
		try {
			const box = await Boxes.findByIdAndDelete(_id);

			if (!box) {
				return res.status(404).json({
					success: false,
					message: `Box with ID ${_id} was not found`,
				});
			}

			console.log(`Box with ID ${_id} was deleted successfully.`);
			return res.status(200).json({
				success: true,
				message: `Box with ID ${_id} was deleted successfully`,
				data: box,
			});
		} catch (error) {
			console.error(`Błąd podczas usuwania boxa ${_id}:`, error);
			return res.status(500).json({
				success: false,
				message: "Wystąpił błąd podczas usuwania boxa",
			});
		}
	},
];
