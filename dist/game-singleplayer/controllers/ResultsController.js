"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleGameResultsHandler = void 0;
const mongodb_1 = require("../../database/mongodb");
const mongodb_2 = require("mongodb");
const LocalSettingsStorage_1 = __importDefault(require("../../data/LocalSettingsStorage"));
const Collections_1 = __importDefault(require("../../constants/Collections"));
const singleGameResultsHandler = async (req, res, next) => {
    const settingsId = LocalSettingsStorage_1.default.databaseSettingsCollectionId;
    const gameId = new mongodb_2.ObjectId(req.params.gameid);
    const db = mongodb_1.getDb();
    try {
        const game = await db
            .collection(Collections_1.default.SINGLEPLAYER_GAMES)
            .findOne({ _id: gameId });
        if (!game) {
            res.status(404).json({
                message: 'This game does not exist!',
                points: null,
                givenCorrectAnswers: null,
                questions: null
            });
        }
        const questions = game.questionsTotalNumber;
        const correctAnswers = game.correctAnswers;
        const points = game.points;
        await db.collection(Collections_1.default.SINGLEPLAYER_GAMES).updateOne({ _id: gameId }, {
            $set: { gameStatus: false, finishedAt: new Date() }
        });
        await db.collection(Collections_1.default.SETTINGS).updateOne({ _id: settingsId }, {
            $inc: { finishedSinglePlayer: 1 }
        });
        res.status(200).json({
            message: 'This game is ended!',
            points: points,
            givenCorrectAnswers: correctAnswers,
            questions: questions
        });
    }
    catch (e) {
        // console.log(e)
        res.status(500).json({
            message: 'Server faced some issues. Please try again later.',
            points: null,
            givenCorrectAnswers: null,
            questions: null
        });
    }
};
exports.singleGameResultsHandler = singleGameResultsHandler;
