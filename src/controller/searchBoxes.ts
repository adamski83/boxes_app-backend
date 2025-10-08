import Boxes from "../schema/box";
import { Request, Response } from "express";

export async function searchBoxes(req: Request, res: Response) {
	try {
		const { name, category } = req.query;
		const query: Record<string, unknown> = {};

		if (name) {
			query.name = { $regex: name, $options: "i" };
		}

		if (category) {
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
}
