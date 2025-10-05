import { Request, Response } from "express";
import Boxes from "../schema/box";

export async function getBoxes(req: Request, res: Response): Promise<Response> {
	try {
		const allBoxes = await Boxes.find();
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
