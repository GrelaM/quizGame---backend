"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleGameResultsHandler = void 0;
const mongodb_1 = require("../database/mongodb");
const mongodb_2 = require("mongodb");
const singleGameResultsHandler = (req, res, next) => {
    const gameId = new mongodb_2.ObjectId(req.params.gameid);
    const db = mongodb_1.getDb();
    db.collection('games')
        .findOne({ _id: gameId })
        .then((data) => {
        if (!data) {
            res.status(404).json({
                message: 'This game does not exist!'
            });
        }
        return data;
    })
        .then((game) => {
        const questions = game.questionsTotalNumber;
        const correctAnswers = game.correctAnswers;
        const points = game.points;
        res.status(200).json({
            message: 'This game is ended!',
            points: points,
            givenCorrectAnswers: correctAnswers,
            questions: questions
        });
    })
        .then(() => {
        db.collection('games').updateOne({ _id: gameId }, {
            $set: { gameStatus: false, finishedAt: new Date() }
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: 'Server error...'
        });
    });
};
exports.singleGameResultsHandler = singleGameResultsHandler;
