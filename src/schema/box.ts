import mongoose, { Schema } from 'mongoose';

const boxSchema = new mongoose.Schema({
	name: { type: Schema.Types.String, required: true, unique: true },
	amount: { type: Schema.Types.Number, required: true },
	dimension: { type: Schema.Types.Mixed, required: true },
	usage: { type: Schema.Types.Array },
	picture: { type: Schema.Types.String },
	createdAt: { type: Date, default: Date.now },
});

const Boxes = mongoose.model('Box', boxSchema);
export default Boxes;
