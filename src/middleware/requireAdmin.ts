// src/middleware/requireAdmin.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requireAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Pobierz token z nagłówka (już zweryfikowany przez verifyToken)
		const token = req.headers.token as string;

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Brak tokenu",
			});
		}

		// Dekoduj token ponownie, aby uzyskać rolę
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

		// Sprawdź rolę
		if (
			!decoded ||
			typeof decoded !== "object" ||
			!("role" in decoded) ||
			decoded.role !== "admin"
		) {
			return res.status(403).json({
				success: false,
				message: "Brak uprawnień administratora",
			});
		}

		next();
	} catch (error) {
		console.error("Błąd weryfikacji uprawnień admina:", error);
		return res.status(500).json({
			success: false,
			message: "Błąd serwera przy weryfikacji uprawnień",
		});
	}
};
