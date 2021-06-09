"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostUpdateSocket = void 0;
const mongodb_1 = require("../../../database/mongodb");
const Collections_1 = __importDefault(require("../../../constants/Collections"));
const hostUpdateSocket = async (room, passedSocketId) => {
    const db = mongodb_1.getDb();
    await db.collection(Collections_1.default.MULTIPLAYER_HOSTS).deleteOne({ socketId: passedSocketId });
    //   io.to(room).emit('host-Update', {
    //     type: 'warning',
    //     message: `Host has left the game...`
    //   })
};
exports.hostUpdateSocket = hostUpdateSocket;
