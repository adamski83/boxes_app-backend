// src/middleware/verifyToken.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "Brak tokenu autoryzacyjnego",
			});
		}

		const token = authHeader.split(" ")[1];

		jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
			if (err) {
				return res.status(403).json({
					success: false,
					message: "Token nieprawidłowy lub wygasł",
				});
			}

			// Dodaj zdekodowane dane do obiektu request
			req.user = decoded;

			// Jeśli potrzebujesz dostępu do roli
			if (decoded && typeof decoded === "object" && "role" in decoded) {
				req.role = decoded.role;
			}

			next();
		});
	} catch (error) {
		console.error("Błąd weryfikacji tokenu:", error);
		return res.status(500).json({
			success: false,
			message: "Błąd serwera przy weryfikacji tokenu",
		});
	}
};
