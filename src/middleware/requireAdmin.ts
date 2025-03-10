import { NextFunction, Request, Response } from "express";

export const requireAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Sprawdź czy użytkownik jest zalogowany
	if (!req.user) {
		return res.status(401).json({
			success: false,
			message: "Wymagane uwierzytelnienie",
		});
	}

	// Sprawdź czy użytkownik ma rolę admin
	if (req.user.role !== "admin") {
		return res.status(403).json({
			success: false,
			message: "Brak uprawnień administratora",
		});
	}

	next();
};
