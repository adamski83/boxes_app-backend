import multer from "multer";
import fs from "fs";
import path from "path";

export const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = path.join(__dirname, "../uploads");

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
			console.log("Utworzono katalog uploads:", uploadDir);
		}

		console.log("Zapisuję plik do:", uploadDir);
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const filename =
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
		console.log("Nazwa pliku:", filename);
		cb(null, filename);
	},
});

export const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		console.log("Typ pliku:", file.mimetype);
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Tylko pliki obrazów są dozwolone!"));
		}
	},
});
