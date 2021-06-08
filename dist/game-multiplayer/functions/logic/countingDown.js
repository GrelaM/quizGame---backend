"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../../app");
const Sockets_1 = __importDefault(require("../../../constants/Sockets"));
const triggerAfter_1 = __importDefault(require("../../../function/triggerAfter"));
const countingDown = async (room, time) => {
    const counter = time;
    app_1.io.to(room).emit(Sockets_1.default.COUNTER, {
        message: 'Get ready!',
        counter: counter
    });
    await Promise.all([triggerAfter_1.default(counter * 1000)]);
};
exports.default = countingDown;
