"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const mongodb_1 = require("./database/mongodb");
const updateQuestionsHandler_1 = __importDefault(require("./function/updateQuestionsHandler"));
const LocalSettingsStorage_1 = __importDefault(require("./data/LocalSettingsStorage"));
const SettingsRoutes_1 = __importDefault(require("./routes/SettingsRoutes"));
const GameRoutes_1 = __importDefault(require("./routes/GameRoutes"));
const SinglePlayerRoutes_1 = __importDefault(require("./routes/SinglePlayerRoutes"));
const ResultsRoutes_1 = __importDefault(require("./routes/ResultsRoutes"));
const app = express_1.default();
app.use(body_parser_1.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/settings', SettingsRoutes_1.default);
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
mongodb_1.mongoConnect(() => {
    LocalSettingsStorage_1.default.setUpSettingsCollection()
        .then(() => {
        updateQuestionsHandler_1.default();
    })
        .then(() => {
        app.listen(8080, () => {
            console.log('Server is running at PORT 8080!');
        });
    })
        .catch((err) => console.log(err));
});
