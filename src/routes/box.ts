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
	const { id } = req.params;

	try {
		const box = await Boxes.findById(id);
		if (!box) {
			return res.status(404).json({ message: "Box not found" });
		}
		return res.status(200).json(box);
	} catch (error) {
		return res.status(500).json({ message: "Internal server error", error });
	}
});

router.delete("/box/:id", async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const box = await Boxes.findByIdAndDelete(id);
		if (!box) {
			return res.status(404).json({ message: "Box not found" });
		}
		return res.status(200).json({ message: "Box deleted successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error", error });
	}
});

router.delete("/box/:id", async (req: Request, res: Response) => {
	const boxId = req.params.id;

	try {
		const box = await Boxes.findByIdAndDelete(boxId);

		if (box) {
			console.log(`Box with ID ${boxId} was deleted successfully.`);
			res.send(`Box with ID ${boxId} was deleted successfully.`);
		} else {
			console.log(`Box with ID ${boxId} was not found.`);
		}
	} catch (error) {
		console.log(error);
	}
});

router.post("/box", async (req: Request, res: Response) => {
	const {
		name,
		description,
		amount,
		dimension,
		usage,
		picture,
		createdAt,
		storage,
		status,
	} = req.body;

	console.log(req.body);

	try {
		const newBox = new Boxes({
			name,
			description,
			amount,
			dimension,
			usage,
			picture,
			createdAt,
			storage,
			status,
		});
		await newBox.save();
		res.status(201).json(newBox);
	} catch (error) {
		res.status(500).json({ message: "Wystąpił błąd podczas dodawania boxa" });
	}
});

router.put("/box/:id", async (req: Request, res: Response) => {
	const boxId = req.params.id;
	const {
		name,
		description,
		amount,
		dimension,
		usage,
		picture,
		createdAt,
		storage,
		status,
	} = req.body;
	console.log(req.body.amount);

	try {
		const box = await Boxes.findByIdAndUpdate(
			boxId,
			{
				name,
				description,
				amount,
				dimension,
				usage,
				picture,
				createdAt,
				storage,
				status,
			},
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
