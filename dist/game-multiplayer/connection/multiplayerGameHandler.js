"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multiplayer_1 = require("../functions/tasks/multiplayer");
const gameHostSocket_1 = require("../functions/tasks/gameHostSocket");
const joinSocket_1 = require("../functions/tasks/joinSocket");
const disconnectSocket_1 = require("../functions/tasks/disconnectSocket");
const singleAnswerSocket_1 = require("../functions/tasks/singleAnswerSocket");
const Sockets_1 = __importDefault(require("../../constants/Sockets"));
const multiplayerGameHandler = (socket) => {
    socket.on(Sockets_1.default.HOST, (data, callback) => {
        gameHostSocket_1.gameHostSocket(socket, data.gameId, data.roomId, callback);
    });
    socket.on(Sockets_1.default.JOIN, ({ id = socket.id, room, nickname, gameid }) => {
        joinSocket_1.joinSocket(socket, id, gameid, room, nickname);
    });
    socket.on(Sockets_1.default.START_GAME, (data) => {
        multiplayer_1.multiplayer(socket, data.roomId, data.gameId);
    });
    socket.on(Sockets_1.default.ANSWER, (data) => {
        singleAnswerSocket_1.singleAnswerSocket(socket, data);
    });
    socket.on(Sockets_1.default.SOCKET_DISCONNECT, async () => {
        console.log('Someone had left...');
        disconnectSocket_1.disconnectSocket(socket);
    });
};
exports.default = multiplayerGameHandler;
