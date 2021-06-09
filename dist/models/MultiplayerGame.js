"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../database/mongodb");
const idGenerator_1 = __importDefault(require("../function/idGenerator"));
class Game {
    constructor(questionsTotalNumber, questions, timer, idLength) {
        this.roomId = idGenerator_1.default(idLength);
        this.questionsTotalNumber = questionsTotalNumber;
        this.questions = questions;
        this.givenAnswers = 0;
        this.gameStatus = true;
        this.timer = timer;
        this.establishedAt = new Date();
    }
    save() {
        const db = mongodb_1.getDb();
        return db
            .collection('multiplayer-games')
            .insertOne(this)
            .then((result) => {
            const newGame = result.ops[0];
            return newGame;
        })
            .catch((err) => console.log(err));
    }
}
exports.default = Game;
