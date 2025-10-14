import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const PDF_DIR = path.join(__dirname, "../pdfs");

if (!fs.existsSync(PDF_DIR)) {
	fs.mkdirSync(PDF_DIR, { recursive: true });
}

router.get("/pdf/search", async (req: Request, res: Response) => {
	try {
		const { name, sortBy = "name", order = "asc" } = req.query;

		const files = fs.readdirSync(PDF_DIR);

		let pdfFiles = files
			.filter((file) => file.toLowerCase().endsWith(".pdf"))
			.map((file) => {
				const filePath = path.join(PDF_DIR, file);
				const stats = fs.statSync(filePath);

				return {
					name: file,
					path: `/pdfs/${file}`,
					size: stats.size,
					sizeFormatted: formatBytes(stats.size),
					createdAt: stats.birthtime,
					modifiedAt: stats.mtime,
				};
			});

		if (name && typeof name === "string") {
			const searchTerm = name.toLowerCase();
			pdfFiles = pdfFiles.filter((file) =>
				file.name.toLowerCase().includes(searchTerm)
			);
		}

		pdfFiles.sort((a, b) => {
			let aValue: any = a[sortBy as keyof typeof a];
			let bValue: any = b[sortBy as keyof typeof b];

			if (sortBy === "createdAt" || sortBy === "modifiedAt") {
				aValue = new Date(aValue).getTime();
				bValue = new Date(bValue).getTime();
			}

			if (order === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		return res.status(200).json({
			success: true,
			count: pdfFiles.length,
			data: pdfFiles,
		});
	} catch (error) {
		console.error("Błąd podczas wyszukiwania PDF:", error);
		return res.status(500).json({
			success: false,
			message: "Wystąpił błąd podczas wyszukiwania plików PDF",
		});
	}
});

router.get("/pdf/:filename", (req: Request, res: Response) => {
	try {
		const { filename } = req.params;
		const filePath = path.join(PDF_DIR, filename);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({
				success: false,
				message: "Plik nie został znaleziony",
			});
		}

		res.sendFile(filePath);
	} catch (error) {
		console.error("Błąd podczas pobierania PDF:", error);
		return res.status(500).json({
			success: false,
			message: "Wystąpił błąd podczas pobierania pliku",
		});
	}
});

function formatBytes(bytes: number, decimals = 2): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export { router as pdfRouter };
