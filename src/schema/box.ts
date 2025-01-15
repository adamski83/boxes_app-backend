import mongoose, { Schema } from "mongoose";

export interface IBox {
	name: string;
	amount: number;
	dimension: {
		width: number;
		height: number;
		depth: number;
	};
	usage: string[] | undefined;
	picture: string;
	createdAt: Date;
	storage: string;
}

const boxSchema = new mongoose.Schema<IBox>({
	name: { type: Schema.Types.String, required: true, unique: true },
	amount: { type: Schema.Types.Number, required: true },
	dimension: { type: Schema.Types.Mixed },
	usage: { type: Schema.Types.Array },
	picture: { type: Schema.Types.String },
	createdAt: { type: Date, default: Date.now },
	storage: { type: Schema.Types.String },
});

const Boxes = mongoose.model("Box", boxSchema);
export default Boxes;
