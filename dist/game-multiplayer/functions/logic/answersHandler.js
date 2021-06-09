"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalDataStorage_1 = __importDefault(require("../../../data/LocalDataStorage"));
const mongodb_1 = require("../../../database/mongodb");
const Collections_1 = __importDefault(require("../../../constants/Collections"));
const answersHandler = async (roomId, game) => {
    const db = mongodb_1.getDb();
    try {
        const localGame = LocalDataStorage_1.default.getLocalGameStatus(roomId);
        if (localGame) {
            const players = await db
                .collection(Collections_1.default.MULTIPLAYER_PLAYERS)
                .find({ roomId: roomId })
                .toArray();
            players.forEach((mongoDbEl) => {
                const localPlayer = localGame.players.find((e) => e.socketId === mongoDbEl.socketId);
                if (!localPlayer) {
                    db.collection(Collections_1.default.MULTIPLAYER_PLAYERS).updateOne({ socketId: mongoDbEl.socketId }, { $inc: { incorrectAnswers: 1 }, $set: { lastTwoAnswers: 0 } });
                }
                else {
                    const answerCheck = checkingHandler(localPlayer.currentAnswer, mongoDbEl.lastTwoAnswers);
                    if (answerCheck.status === 'wrong') {
                        db.collection(Collections_1.default.MULTIPLAYER_PLAYERS).updateOne({ socketId: mongoDbEl.socketId }, { $inc: { incorrectAnswers: 1 }, $set: { lastTwoAnswers: 0 } });
                    }
                    else if (answerCheck.status === 'good') {
                        db.collection(Collections_1.default.MULTIPLAYER_PLAYERS).updateOne({ socketId: mongoDbEl.socketId }, {
                            $inc: {
                                correctAnswers: 1,
                                lastTwoAnswers: 1,
                                points: answerCheck.points
                            }
                        });
                    }
                }
            });
            LocalDataStorage_1.default.resetGameAnswersState(roomId);
        }
    }
    catch (e) {
        throw e;
    }
};
exports.default = answersHandler;
// Answer Handler
const checkingHandler = (singleAnswer, bonus) => {
    let data;
    const answerCheckResult = singleAnswer.code === 0 ? true : false;
    const multiplier = hintsConverter(singleAnswer.hints);
    const bonusPoints = bonus >= 2 ? true : false;
    if (!answerCheckResult) {
        return (data = {
            status: 'wrong',
            incorrectAnswer: 1,
            correctAnswer: 0,
            points: 0
        });
    }
    else if (answerCheckResult && bonusPoints) {
        const pointsCalc = 1 * multiplier * 2;
        return (data = {
            status: 'good',
            incorrectAnswer: 0,
            correctAnswer: 1,
            points: pointsCalc
        });
    }
    else if (answerCheckResult) {
        const pointsCalc = 1 * multiplier;
        return (data = {
            status: 'good',
            incorrectAnswer: 0,
            correctAnswer: 1,
            points: pointsCalc
        });
    }
    else {
        return (data = {
            status: 'wrong',
            incorrectAnswer: 1,
            correctAnswer: 0,
            points: 0
        });
    }
};
const hintsConverter = (hints) => {
    let pointsFactor = 0;
    switch (hints) {
        case 1:
            return (pointsFactor = 3);
        case 2:
            return (pointsFactor = 2);
        case 3:
            return (pointsFactor = 1);
        default:
            return (pointsFactor = 0);
    }
};
