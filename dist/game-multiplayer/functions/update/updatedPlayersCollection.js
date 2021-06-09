"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedPlayersCollection = void 0;
const mongodb_1 = require("../../../database/mongodb");
const Collections_1 = __importDefault(require("../../../constants/Collections"));
const updatedPlayersCollection = async (passedRoomId) => {
    try {
        const db = mongodb_1.getDb();
        const allPlayers = await db
            .collection(Collections_1.default.MULTIPLAYER_PLAYERS)
            .find({ roomId: passedRoomId })
            .toArray();
        const allPlayersArray = [];
        allPlayers.forEach((el) => allPlayersArray.push(el.nickname));
        return allPlayersArray;
    }
    catch (e) {
        throw e;
    }
};
exports.updatedPlayersCollection = updatedPlayersCollection;
