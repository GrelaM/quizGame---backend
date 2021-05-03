"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../database/mongodb");
const idGenerator_1 = __importDefault(require("../function/idGenerator"));
class Game {
    constructor(questionsTotalNumber, questions, timer) {
        this.artificialGameId = idGenerator_1.default(6);
        this.questionsTotalNumber = questionsTotalNumber;
        this.questions = questions;
        this.givenAnswers = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.lastTwoAnswers = 0;
        this.points = 0;
        this.gameStatus = true;
        this.timer = timer;
        this.establishedAt = new Date();
    }
    save() {
        const db = mongodb_1.getDb();
        return db
            .collection('games')
            .insertOne(this)
            .then((result) => {
            const newGame = result.ops[0];
            return newGame;
        })
            .catch((err) => console.log(err));
    }
}
exports.default = Game;
