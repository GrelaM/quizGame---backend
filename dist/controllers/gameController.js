"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNewGame = void 0;
const mongodb_1 = require("../database/mongodb");
const Game_1 = __importDefault(require("../models/Game"));
const startNewGame = (req, res, next) => {
    const reqSettings = {
        quantity: Number(req.body.quantity),
        time: Number(req.body.time),
        level: Number(req.body.level)
    };
    const db = mongodb_1.getDb();
    return db
        .collection('questions')
        .aggregate([
        { $match: { Difficulty: reqSettings.level } },
        { $sample: { size: reqSettings.quantity } }
    ])
        .toArray()
        .then((questions) => {
        const newGame = new Game_1.default(reqSettings.quantity, questions, reqSettings.time);
        newGame
            .save()
            .then((game) => {
            res
                .status(200)
                .json({
                message: 'New Game has been created...',
                gameId: game._id,
                artificialGameId: game.artificialGameId,
                timer: game.timer
            });
        })
            .catch((err) => console.log(err));
    })
        .catch((err) => console.log(err));
};
exports.startNewGame = startNewGame;
