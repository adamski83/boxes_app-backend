// src/utils/tokenUtils.ts
import jwt from "jsonwebtoken";

export const getUserIdFromToken = (token: string): string | null => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
		if (decoded && typeof decoded === "object" && "id" in decoded) {
			return decoded.id as string;
		}
		return null;
	} catch (error) {
		return null;
	}
};

export const getRoleFromToken = (token: string): string | null => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
		if (decoded && typeof decoded === "object" && "role" in decoded) {
			return decoded.role as string;
		}
		return null;
	} catch (error) {
		return null;
	}
};
