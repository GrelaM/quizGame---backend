"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinSocket = void 0;
const mongodb_1 = require("../../../database/mongodb");
const updatedPlayersCollection_1 = require("../../functions/update/updatedPlayersCollection");
const Collections_1 = __importDefault(require("../../../constants/Collections"));
const LocalDataStorage_1 = __importDefault(require("../../../data/LocalDataStorage"));
const Sockets_1 = __importDefault(require("../../../constants/Sockets"));
const joinSocket = async (socket, socketId, roomId, nickname) => {
    const db = mongodb_1.getDb();
    const newPlayer = {
        socketId: socketId,
        roomId: roomId,
        nickname: nickname,
        correctAnswers: 0,
        incorrectAnswers: 0,
        lastTwoAnswers: 0,
        points: 0
    };
    try {
        await db.collection(Collections_1.default.MULTIPLAYER_PLAYERS).insertOne(newPlayer);
        const playersCollectionUpdate = await updatedPlayersCollection_1.updatedPlayersCollection(roomId);
        const localPlayersCollectionUpdate = LocalDataStorage_1.default.addNewPlayer(roomId, newPlayer);
        if (!localPlayersCollectionUpdate) {
            throw new Error();
        }
        socket.join(roomId);
        socket.emit(Sockets_1.default.PLAYERS_UPDATE, {
            type: 'success',
            title: `${nickname}`,
            message: `Welcome in game ${roomId}!`,
            allPlayers: playersCollectionUpdate
        });
        socket.broadcast.to(roomId).emit(Sockets_1.default.PLAYERS_UPDATE, {
            type: 'success',
            title: 'New Player',
            message: `${nickname} has joined the game!`,
            allPlayers: playersCollectionUpdate
        });
    }
    catch (e) {
        console.log(e);
        socket.emit(Sockets_1.default.PLAYERS_UPDATE, {
            type: 'error',
            title: `${nickname}`,
            message: `Connection error! You are not admitted to game room! Please try again...`,
            allPlayers: []
        });
    }
};
exports.joinSocket = joinSocket;
