"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplayerController = void 0;
const multiplayerController = (req, res, next) => {
    const io = req.app.get('socketio');
    io.on('connection', (socket) => {
        console.log('We have a new connection...');
    });
};
exports.multiplayerController = multiplayerController;
