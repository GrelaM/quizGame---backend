"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameHostSocket = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../../../database/mongodb");
const Collections_1 = __importDefault(require("../../../constants/Collections"));
const LocalDataStorage_1 = __importDefault(require("../../../data/LocalDataStorage"));
const gameHostSocket = async (socket, gameId, roomId, callback) => {
    const db = mongodb_2.getDb();
    const mongodbId = new mongodb_1.ObjectId(gameId);
    try {
        const game = await db
            .collection(Collections_1.default.MULTIPLAYER_GAMES)
            .findOne({ _id: mongodbId });
        LocalDataStorage_1.default.saveLocalGameStatus({
            gameId: gameId,
            roomId: roomId,
            players: [],
            receivedAnswers: game.givenAnswers,
            gameShouldGoOn: true
        });
        const newHost = {
            socketId: socket.id,
            room: roomId
        };
        await db.collection(Collections_1.default.MULTIPLAYER_HOSTS).insertOne(newHost);
        socket.join(roomId, callback({
            roomState: true,
            alert: {
                type: 'success',
                status: true,
                title: 'Success',
                message: 'You entered room successfully.'
            }
        }));
    }
    catch (e) {
        console.log(e);
        callback({
            roomState: false,
            alert: {
                type: 'error',
                status: true,
                title: 'Sorry',
                message: 'Something went wrong...'
            }
        });
    }
};
exports.gameHostSocket = gameHostSocket;
