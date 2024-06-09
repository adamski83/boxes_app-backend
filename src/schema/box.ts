import mongoose from 'mongoose';

const boxSchema = new mongoose.Schema({
	name: String,
	amount: Number,
	createdAt: { type: Date, default: Date.now },
});

const Boxes = mongoose.model('Box', boxSchema);
export default Boxes;
