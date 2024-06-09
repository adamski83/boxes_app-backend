import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import boxSchema from './schema/box';

const app = express();

app.use(express.json());
app.use(cors());

mongoose
	.connect('mongodb://127.0.0.1:27017/sacs')
	.catch((error) => console.log(error));

app.get('/api/box/search', async (req: Request, res: Response) => {
	const allBoxes = await boxSchema.find({});
	console.log(allBoxes);
	res.json(allBoxes);
});

app.listen(5000, () => {
	console.log(`app is running on http://localhost:5000`);
});
