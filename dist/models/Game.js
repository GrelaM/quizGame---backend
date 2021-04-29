"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
class Game {
    constructor(id, totalNum, questions, givenAnswers, points, status, timer, establishedDate) {
        this.gameId = id;
        this.totalQuestionNumber = totalNum;
        this.questions = questions;
        this.givenAnswers = givenAnswers;
        this.points = points;
        this.gameStatus = status;
        this.timer = timer;
        this.establishedAt = establishedDate;
    }
}
exports.Game = Game;
