"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Collections_1 = __importDefault(require("../../../constants/Collections"));
const mongodb_1 = require("../../../database/mongodb");
const mongodb_2 = require("mongodb");
const fetchingGameData = async (room, gameId) => {
    const gameIdMongoDBFormat = new mongodb_2.ObjectId(gameId);
    const db = mongodb_1.getDb();
    const game = await db
        .collection(Collections_1.default.MULTIPLAYER_GAMES)
        .findOne({ _id: gameIdMongoDBFormat });
    const players = await db
        .collection(Collections_1.default.MULTIPLAYER_PLAYERS)
        .find({ gameId: gameId, roomId: room })
        .toArray();
    if (!game || players.length <= 0) {
        throw new Error('We have a problem. Game does not exist or there are no players!!!');
    }
    return { game: game, players: players };
};
exports.default = fetchingGameData;
