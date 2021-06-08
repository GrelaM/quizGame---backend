"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerUpdateSocket = void 0;
const app_1 = require("../../../app");
const mongodb_1 = require("../../../database/mongodb");
const updatedPlayersCollection_1 = require("./updatedPlayersCollection");
const Collections_1 = __importDefault(require("../../../constants/Collections"));
const LocalDataStorage_1 = __importDefault(require("../../../data/LocalDataStorage"));
const Sockets_1 = __importDefault(require("../../../constants/Sockets"));
const playerUpdateSocket = async (player, passedSocketId) => {
    const db = mongodb_1.getDb();
    const room = player.roomId;
    const nickname = player.nickname;
    const gameId = player.gameId;
    await db
        .collection(Collections_1.default.MULTIPLAYER_PLAYERS)
        .deleteOne({ socketId: passedSocketId });
    const playersCollectionUpdate = await updatedPlayersCollection_1.updatedPlayersCollection(room, gameId);
    LocalDataStorage_1.default.deletePlayer(player);
    app_1.io.to(room).emit(Sockets_1.default.PLAYERS_UPDATE, {
        type: 'info',
        message: `${nickname} has left the game...`,
        allPlayers: playersCollectionUpdate
    });
};
exports.playerUpdateSocket = playerUpdateSocket;
