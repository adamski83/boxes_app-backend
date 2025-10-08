import { Request, Response } from "express";
import Boxes from "../schema/box";
import { verifyToken } from "../middleware/verifyToken";
import { validateObjectId } from "../middleware/validateObjectId";
import { upload } from "../middleware/uploadHelper";
import { BoxType } from "../types/boxType";

export const updateOneBox = [
	verifyToken,
	validateObjectId,
	upload.single("uploaded_file"),

	async (req: Request, res: Response) => {
		const { _id } = req.params;
		const { name, amount, usage, storage, status, category } = req.body;

		if (!name || name.trim() === "") {
			return res.status(400).json({
				success: false,
				message: "Nazwa jest wymagana",
			});
		}

		try {
			const updateData: BoxType = {
				name: name.trim(),
				amount: parseInt(amount) || 0,
				usage: usage || "",
				storage: storage || "Warehouse A",
				category: category || "box",
				status: status || "TODO",
				updatedAt: new Date(),
			};

			if (req.file) {
				updateData.picture = `/uploads/${req.file.filename}`;
			}

			const box = await Boxes.findByIdAndUpdate(_id, updateData, {
				new: true,
				runValidators: true,
			});

			if (!box) {
				return res.status(404).json({
					success: false,
					message: "Box o podanym id nie został znaleziony",
				});
			}

			return res.status(200).json({
				success: true,
				data: box,
			});
		} catch (error) {
			console.error(`Błąd podczas aktualizacji boxa ${_id}:`, error);
			return res.status(500).json({
				success: false,
				message: "Wystąpił błąd podczas aktualizacji boxa",
			});
		}
	},
];
