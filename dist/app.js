"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const path_1 = __importDefault(require("path"));
const xlsx = require('xlsx');
const GamesStorage_1 = require("./data/GamesStorage");
const GameRoutes_1 = __importDefault(require("./routes/GameRoutes"));
const SinglePlayerRoutes_1 = __importDefault(require("./routes/SinglePlayerRoutes"));
const ResultsRoutes_1 = __importDefault(require("./routes/ResultsRoutes"));
const app = express_1.default();
const filePath = path_1.default.resolve(__dirname, './data/Data.xlsx');
const questionsFile = xlsx.readFile(filePath);
const questionsInEnglish = questionsFile.Sheets['English'];
const data = xlsx.utils.sheet_to_json(questionsInEnglish);
GamesStorage_1.gamesStorage.addQuestions(data);
app.use(body_parser_1.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/game', GameRoutes_1.default);
app.use('/singleplayer', SinglePlayerRoutes_1.default);
app.use('/results', ResultsRoutes_1.default);
app.use((error, req, res, next) => {
    console.log(error);
    const name = error.name;
    const message = error.message;
    const data = error.stack;
    res.status(500).json({ name: name, message: message, data: data });
});
app.listen(8080, () => console.log('Server is running at PORT 8080!'));
