"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNewGame = void 0;
const mongodb_1 = require("../database/mongodb");
const Game_1 = __importDefault(require("../models/Game"));
const startNewGame = (req, res, next) => {
    const db = mongodb_1.getDb();
    return db
        .collection('questions')
        .aggregate([
        // { $match: { Difficulty: 2 } }, // LATER WE CAN CHOOSE DIFFICULTY LEVEL
        { $sample: { size: 10 } }
    ])
        .toArray()
        .then((questions) => {
        const newGame = new Game_1.default(10, questions, 15);
        newGame
            .save()
            .then((game) => {
            res
                .status(200)
                .json({
                message: 'New Game has been created...',
                gameId: game._id,
                artificialGameId: game.artificialGameId
            });
        })
            .catch((err) => console.log(err));
    })
        .catch((err) => console.log(err));
};
exports.startNewGame = startNewGame;
