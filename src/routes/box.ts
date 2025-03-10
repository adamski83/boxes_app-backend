import express, { Request, Response } from "express";
import Boxes from "../schema/box";
import { verifyToken } from "./user";
import { isValidObjectId } from "mongoose";
const router = express.Router();

const validateObjectId = (
	req: Request,
	res: Response,
	next: express.NextFunction
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

router.get("/box/search", verifyToken, async (req: Request, res: Response) => {
	try {
		const { name, category } = req.query;
		const query: Record<string, unknown> = {};

		if (name) {
			query.name = { $regex: name, $options: "i" };
		}

		if (category) {
			// Obsługa pojedynczej kategorii lub wielu kategorii jako tablica
			if (Array.isArray(category)) {
				query.category = { $in: category };
			} else {
				query.category = category;
			}
		}

		const allBoxes = await Boxes.find(query);

		return res.status(200).json({
			success: true,
			count: allBoxes.length,
			data: allBoxes,
		});
	} catch (error) {
		console.error("Błąd podczas pobierania boxów:", error);
		return res.status(500).json({
			success: false,
			message: "Wystąpił błąd podczas pobierania boxów",
		});
	}
});

router.get(
	"/box/:_id",
	verifyToken,
	validateObjectId,
	async (req: Request, res: Response) => {
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
	}
);

router.delete(
	"/box/:_id",
	verifyToken,
	validateObjectId,
	// requireAdmin,
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
	}
);

router.post("/box", verifyToken, async (req: Request, res: Response) => {
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
		category,
	} = req.body;

	if (!name || name.trim() === "") {
		return res.status(400).json({
			success: false,
			message: "Nazwa jest wymagana",
		});
	}

	try {
		const newBox = new Boxes({
			name,
			description,
			amount,
			dimension,
			usage,
			picture,
			createdAt: createdAt || new Date(),
			storage,
			status: status || "TODO",
			category: category || "tape",
		});

		await newBox.save();

		return res.status(201).json({
			success: true,
			data: newBox,
		});
	} catch (error) {
		console.error("Błąd podczas dodawania boxa:", error);
		return res.status(500).json({
			success: false,
			message: "Wystąpił błąd podczas dodawania boxa",
		});
	}
});

router.put(
	"/box/:_id",
	verifyToken,
	validateObjectId,
	async (req: Request, res: Response) => {
		const { _id } = req.params;

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

		if (!name || name.trim() === "") {
			return res.status(400).json({
				success: false,
				message: "Nazwa jest wymagana",
			});
		}

		try {
			const box = await Boxes.findByIdAndUpdate(
				_id,
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
					updatedAt: new Date(),
				},
				{ new: true, runValidators: true }
			);

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
	}
);

export { router as boxRouter };
