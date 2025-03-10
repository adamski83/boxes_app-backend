import mongoose from "mongoose";

const BoxSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Nazwa jest wymagana"],
	},
	description: {
		type: String,
	},
	amount: {
		type: Number,
		required: [true, "Ilość jest wymagana"],
		min: [0, "Ilość nie może być mniejsza niż 0"],
	},
	dimension: {
		type: String,
	},
	usage: {
		type: String,
	},
	picture: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	storage: {
		type: String,
		enum: [
			"Warehouse A",
			"Warehouse B",
			"Storage Room 1",
			"Storage Room 2",
			"External Storage",
		],
		default: "Warehouse A",
	},
	category: {
		type: String,
		enum: ["box", "tape", "foil", "sticker", "filler", "other"],
		required: [true, "Kategoria jest wymagana"],
		default: "other",
	},
	status: {
		type: String,
		enum: ["TODO", "IN_PROGRESS", "DONE"],
		default: "TODO",
	},
});

export default mongoose.model("Boxes", BoxSchema);
