"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNewGame = void 0;
const Game_1 = require("../models/Game");
const GamesStorage_1 = require("../data/GamesStorage");
const startNewGame = (req, res, next) => {
    const id = GamesStorage_1.gamesStorage.generateNewId();
    const totalQuestionNum = req.body.totalQuestionNum || 10;
    const questions = GamesStorage_1.gamesStorage.getQuestionsPackage(totalQuestionNum);
    const answers = 0;
    const points = 0;
    const gameStatus = true;
    const timer = req.body.timer || 9; // We need this to change!!!
    const cratedAt = new Date();
    const newGame = new Game_1.Game(id, totalQuestionNum, questions, answers, points, gameStatus, timer, cratedAt);
    GamesStorage_1.gamesStorage.addNewGame(newGame);
    res.status(201).json({
        message: 'New Game was created!',
        gameId: newGame.gameId,
        timer: newGame.timer
    });
};
exports.startNewGame = startNewGame;
