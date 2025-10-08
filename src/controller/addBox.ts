import { Request, Response } from "express";
import Boxes from "../schema/box";
import { upload } from "../middleware/uploadHelper";

export const addBoxWithUpload = [
	upload.single("uploaded_file"),
	async (req: Request, res: Response) => {
		console.log("=== DEBUG INFO ===");
		console.log("Body:", req.body);
		console.log("File:", req.file);
		console.log("==================");

		const { name, amount, usage, storage, category, status } = req.body;

		if (!name || name.trim() === "") {
			return res.status(400).json({
				success: false,
				message: "Nazwa jest wymagana",
			});
		}

		try {
			const boxData = {
				name: name.trim(),
				amount: parseInt(amount) || 0,
				usage: usage || "",
				storage: storage || "Warehouse A",
				category: category || "box",
				status: status || "TODO",
				createdAt: new Date(),
				picture: req.file ? `/uploads/${req.file.filename}` : undefined,
			};

			const newBox = new Boxes(boxData);
			await newBox.save();

			return res.status(201).json({
				success: true,
				data: newBox,
				message: "Box został pomyślnie dodany",
			});
		} catch (error) {
			console.error("Błąd:", error);
			return res.status(500).json({
				success: false,
				message: "Wystąpił błąd podczas dodawania boxa",
			});
		}
	},
];
