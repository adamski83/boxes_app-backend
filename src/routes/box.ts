import express, { Request, Response } from "express";
import Boxes from "../schema/box";
import { verifyToken } from "./user";

const router = express.Router();

router.get("/box/search", verifyToken, async (req: Request, res: Response) => {
	try {
		const allBoxes = await Boxes.find({});
		res.json(allBoxes);
	} catch (error) {
		res.status(400).json({ message: "Wystąpił błąd podczas pobierania boxów" });
	}
});

router.get("/box/:id", async (req: Request, res: Response) => {
	const boxId = req.params.id;

	try {
		const box = await Boxes.findById(boxId);
		if (!box) {
			return res
				.status(404)
				.json({ message: "Box o podanym id nie został znaleziony" });
		}
		res.json(box);
	} catch (error) {
		res.status(500).json({ message: "Wystąpił błąd podczas pobierania boxa" });
	}
});

router.post("/box", async (req: Request, res: Response) => {
	const { name, description } = req.body;

	try {
		const newBox = new Boxes({ name, description });
		await newBox.save();
		res.status(201).json(newBox);
	} catch (error) {
		res.status(500).json({ message: "Wystąpił błąd podczas dodawania boxa" });
	}
});

router.put("/box/:id", async (req: Request, res: Response) => {
	const boxId = req.params.id;
	const { name, description } = req.body;

	try {
		const box = await Boxes.findByIdAndUpdate(
			boxId,
			{ name, description },
			{ new: true }
		);
		if (!box) {
			return res
				.status(404)
				.json({ message: "Box o podanym id nie został znaleziony" });
		}
		res.json(box);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Wystąpił błąd podczas aktualizacji boxa" });
	}
});

export { router as boxRouter };
