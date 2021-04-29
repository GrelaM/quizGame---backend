import express, { NextFunction } from 'express';
import { json } from 'body-parser';
import path from 'path';
const xlsx = require('xlsx');

import { gamesStorage } from './data/GamesStorage';

import gameRoutes from './routes/GameRoutes';
import singlePlayerRoutes from './routes/SinglePlayerRoutes';
import resutlsRoutes from './routes/ResultsRoutes';

const app = express();

const filePath = path.resolve(__dirname, './data/Data.xlsx');
const questionsFile = xlsx.readFile(filePath);
const questionsInEnglish = questionsFile.Sheets['English'];
const data = xlsx.utils.sheet_to_json(questionsInEnglish);
gamesStorage.addQuestions(data);

app.use(json());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use('/game', gameRoutes);
app.use('/singleplayer', singlePlayerRoutes);
app.use('/results', resutlsRoutes);

app.use((error: Error, req: express.Request, res: express.Response, next: NextFunction) => {
	console.log(error);
	const name = error.name;
	const message = error.message;
	const data = error.stack;
	res.status(500).json({ name: name, message: message, data: data });
});

app.listen(8080, () => console.log('Server is running at PORT 8080!'));
