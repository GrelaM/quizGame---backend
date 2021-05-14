"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNewMultiPlayerGame = exports.singlePlayerRecoveryMode = exports.startNewGame = void 0;
const mongodb_1 = require("../database/mongodb");
const mongodb_2 = require("mongodb");
const Game_1 = __importDefault(require("../models/Game"));
const MultiplayerGame_1 = __importDefault(require("../models/MultiplayerGame"));
const LocalSettingsStorage_1 = __importDefault(require("../data/LocalSettingsStorage"));
const startNewGame = (req, res, next) => {
    const settingsId = LocalSettingsStorage_1.default.databaseSettingsCollectionId;
    const db = mongodb_1.getDb();
    const reqSettings = {
        quantity: Number(req.body.quantity),
        time: Number(req.body.time),
        level: Number(req.body.level)
    };
    return db
        .collection('questions')
        .aggregate([
        { $match: { Difficulty: reqSettings.level } },
        { $sample: { size: reqSettings.quantity } }
    ])
        .toArray()
        .then((questions) => {
        const newGame = new Game_1.default(reqSettings.quantity, questions, reqSettings.time);
        return newGame
            .save()
            .then((game) => {
            db.collection('settings')
                .updateOne({ _id: settingsId }, {
                $inc: { requestedSinglePlayer: 1 }
            })
                .catch((err) => console.log(err));
            return game;
        })
            .then((game) => {
            res.status(200).json({
                message: 'New Game has been created...',
                gameId: game._id,
                artificialGameId: game.artificialGameId,
                timer: game.timer
            });
        });
    })
        .catch((err) => console.log(err));
};
exports.startNewGame = startNewGame;
const singlePlayerRecoveryMode = (req, res, next) => {
    const gameId = new mongodb_2.ObjectId(req.params.gameid);
    const db = mongodb_1.getDb();
    db.collection('games')
        .findOne({ _id: gameId })
        .then((data) => {
        res.status(200).json({
            message: 'Game recovered successfully.',
            nextQuestion: data.givenAnswers
        });
    })
        .catch((err) => console.log(err));
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
            const saveNewGame = await newGame.save();
            res.status(200).json({
                message: 'New Game has been created.',
                questions: saveNewGame
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
