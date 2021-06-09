"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNewMultiPlayerGame = exports.singlePlayerRecoveryMode = exports.startNewGame = void 0;
const mongodb_1 = require("../../database/mongodb");
const mongodb_2 = require("mongodb");
const Game_1 = __importDefault(require("../../models/Game"));
const MultiplayerGame_1 = __importDefault(require("../../models/MultiplayerGame"));
const LocalSettingsStorage_1 = __importDefault(require("../../data/LocalSettingsStorage"));
const startNewGame = async (req, res, next) => {
    const settingsId = LocalSettingsStorage_1.default.databaseSettingsCollectionId;
    const db = mongodb_1.getDb();
    const reqSettings = {
        quantity: Number(req.body.quantity),
        time: Number(req.body.time),
        level: Number(req.body.level)
    };
    try {
        const questions = await db
            .collection('questions')
            .aggregate([
            { $match: { Difficulty: reqSettings.level } },
            { $sample: { size: reqSettings.quantity } }
        ])
            .toArray();
        const newGame = new Game_1.default(reqSettings.quantity, questions, reqSettings.time);
        const savedGame = await newGame.save();
        if (savedGame) {
            await db.collection('settings').updateOne({ _id: settingsId }, {
                $inc: { requestedSinglePlayer: 1 }
            });
            res.status(200).json({
                message: 'New Game has been created...',
                gameId: savedGame._id,
                artificialGameId: savedGame.artificialGameId,
                timer: savedGame.timer
            });
        }
    }
    catch (e) {
        res.status(500).json({
            message: 'We sincerely apologize. Something went wrong. We could not create this game.'
        });
    }
};
exports.startNewGame = startNewGame;
const singlePlayerRecoveryMode = async (req, res, next) => {
    const gameId = new mongodb_2.ObjectId(req.params.gameid);
    const db = mongodb_1.getDb();
    try {
        const recoveredGame = await db.collection('games').findOne({ _id: gameId });
        if (recoveredGame) {
            res.status(200).json({
                message: 'Game recovered successfully.',
                nextQuestion: recoveredGame.givenAnswers
            });
        }
    }
    catch (e) {
        res.status(500).json({
            message: 'We sincerely apologize. Something went wrong. We could not recover this game.'
        });
    }
};
exports.singlePlayerRecoveryMode = singlePlayerRecoveryMode;
const startNewMultiPlayerGame = async (req, res, next) => {
    const db = mongodb_1.getDb();
    const reqSettings = {
        quantity: Number(req.body.quantity),
        time: Number(req.body.time),
        level: Number(req.body.level)
    };
    try {
        const questions = await db
            .collection('questions')
            .aggregate([
            { $match: { Difficulty: reqSettings.level } },
            { $sample: { size: reqSettings.quantity } }
        ])
            .toArray();
        const newGame = new MultiplayerGame_1.default(reqSettings.quantity, questions, reqSettings.time, 8 // id_length
        );
        try {
            const savedNewGame = await newGame.save();
            res.status(200).json({
                message: 'New Game has been created...',
                gameId: savedNewGame._id,
                roomId: savedNewGame.roomId
            });
        }
        catch (e) {
            return e;
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.startNewMultiPlayerGame = startNewMultiPlayerGame;
