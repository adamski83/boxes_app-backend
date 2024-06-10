import express, { Request, Response } from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import boxSchema from './schema/box';

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(`${process.env.DB_URL}`).catch((error) => console.log(error));

app.get('/api/box/search', async (req: Request, res: Response) => {
	const allBoxes = await boxSchema.find({});
	console.log(allBoxes);
	res.json(allBoxes);
});

app.listen(5000, () => {
	console.log(`app is running on http://localhost:5000`);
});
