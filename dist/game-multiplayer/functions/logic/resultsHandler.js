"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../../../database/mongodb");
const mongodb_2 = require("mongodb");
const Collections_1 = __importDefault(require("../../../constants/Collections"));
const resultsHandler = async (roomId, gameId) => {
    const db = mongodb_1.getDb();
    const convertedGameId = new mongodb_2.ObjectId(gameId);
    try {
        const game = await db
            .collection(Collections_1.default.MULTIPLAYER_GAMES)
            .findOne({ roomId: roomId, _id: convertedGameId });
        const totalQuestions = game.questionsTotalNumber;
        let finalResults = [];
        const allPlayers = await db
            .collection(Collections_1.default.MULTIPLAYER_PLAYERS)
            .find({ roomId: roomId })
            .toArray();
        allPlayers.map((el) => {
            const data = {
                name: el.nickname,
                correctAnswers: el.correctAnswers,
                totalQuestions: totalQuestions,
                points: el.points
            };
            finalResults.push(data);
        });
        finalResults.sort((a, b) => (a.points < b.points ? 1 : -1));
        return finalResults;
    }
    catch (e) {
        throw e;
    }
};
exports.default = resultsHandler;
