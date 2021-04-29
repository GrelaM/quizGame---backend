"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleGameResultsHandler = void 0;
const GamesStorage_1 = require("../data/GamesStorage");
const singleGameResultsHandler = (req, res, next) => {
    const singleGame = findAndReturnGameHandler(req.params.gameid);
    if (singleGame) {
        const points = singleGame.points;
        const questions = singleGame.totalQuestionNumber;
        res.status(200).json({
            message: 'This game is ended!',
            points: points,
            maxPoints: questions
        });
    }
    else {
        res.status(404).json({
            error: 'This game does not exist!'
        });
    }
};
exports.singleGameResultsHandler = singleGameResultsHandler;
// HANDLERS
const findAndReturnGameHandler = (id) => {
    const singleGame = GamesStorage_1.gamesStorage.games.find((el) => el.gameId === id);
    return singleGame;
};
