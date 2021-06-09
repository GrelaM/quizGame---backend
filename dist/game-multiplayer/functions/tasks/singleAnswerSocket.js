"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleAnswerSocket = void 0;
const LocalDataStorage_1 = __importDefault(require("../../../data/LocalDataStorage"));
const singleAnswerSocket = (socket, data) => {
    LocalDataStorage_1.default.updatePlayer(data.roomId, socket.id, data.code, data.hints);
};
exports.singleAnswerSocket = singleAnswerSocket;
