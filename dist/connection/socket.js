"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const socketHandler = (socket) => {
    socket.on('joinGame', () => {
        console.log('New Connection!');
        socket.emit('joinGame', { message: 'Hi' });
    });
};
exports.socketHandler = socketHandler;
