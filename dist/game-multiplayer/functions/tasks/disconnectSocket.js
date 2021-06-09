"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectSocket = void 0;
const mongodb_1 = require("../../../database/mongodb");
const playerUpdateSocket_1 = require("../update/playerUpdateSocket");
const hostUpdateSocket_1 = require("../update/hostUpdateSocket");
const Collections_1 = __importDefault(require("../../../constants/Collections"));
const disconnectSocket = async (socket) => {
    const db = mongodb_1.getDb();
    try {
        const player = await db
            .collection(Collections_1.default.MULTIPLAYER_PLAYERS)
            .findOne({ socketId: socket.id });
        const host = await db
            .collection(Collections_1.default.MULTIPLAYER_HOSTS)
            .findOne({ socketId: socket.id });
        if (player) {
            await playerUpdateSocket_1.playerUpdateSocket(player, socket.id);
        }
        if (host) {
            await hostUpdateSocket_1.hostUpdateSocket(host.room, socket.id);
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.disconnectSocket = disconnectSocket;
