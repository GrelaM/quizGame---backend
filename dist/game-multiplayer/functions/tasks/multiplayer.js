"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplayer = void 0;
const app_1 = require("../../../app");
const Sockets_1 = __importDefault(require("../../../constants/Sockets"));
const LocalDataStorage_1 = __importDefault(require("../../../data/LocalDataStorage"));
const fetchingGameData_1 = __importDefault(require("../logic/fetchingGameData"));
const countingDown_1 = __importDefault(require("../logic/countingDown"));
const questionHandler_1 = __importDefault(require("../logic/questionHandler"));
const answersHandler_1 = __importDefault(require("../logic/answersHandler"));
const engine_1 = __importDefault(require("../logic/engine"));
const gameUpdate_1 = __importDefault(require("../logic/gameUpdate"));
const resultsHandler_1 = __importDefault(require("../logic/resultsHandler"));
const multiplayer = async (socket, roomId, gameId) => {
    try {
        const gameStatus = LocalDataStorage_1.default.getLocalGameStatus(roomId);
        if (!gameStatus) {
            throw new Error('Sorry. Server failed.');
        }
        // COUNTING DOWN
        await countingDown_1.default(roomId, 3);
        while (gameStatus.gameShouldGoOn) {
            // GAME DETAILS
            const data = await fetchingGameData_1.default(roomId, gameId);
            // QUESTION
            questionHandler_1.default(data, roomId);
            await engine_1.default(data.game.timer, gameStatus);
            // UPDATE
            await answersHandler_1.default(roomId, data.game);
            await gameUpdate_1.default(gameId, roomId);
        }
        if (!gameStatus.gameShouldGoOn) {
            app_1.io.to(roomId).emit(Sockets_1.default.END_GAME, { status: true });
            const results = await resultsHandler_1.default(roomId, gameId);
            app_1.io.to(roomId).emit(Sockets_1.default.RESULTS, { results: results });
        }
    }
    catch (e) {
        app_1.io.to(roomId).emit(Sockets_1.default.FATAL_ERROR, {
            message: 'Sorry. Fatal error occurred.'
        });
        console.log(e);
    }
};
exports.multiplayer = multiplayer;
