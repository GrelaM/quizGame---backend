"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Collections_1 = __importDefault(require("../../../constants/Collections"));
const mongodb_1 = require("../../../database/mongodb");
const mongodb_2 = require("mongodb");
const LocalDataStorage_1 = __importDefault(require("../../../data/LocalDataStorage"));
const gameUpdate = async (gameId, roomId) => {
    const db = mongodb_1.getDb();
    const mongodbGameId = new mongodb_2.ObjectId(gameId);
    try {
        const updatedGame = await db.collection(Collections_1.default.MULTIPLAYER_GAMES).findOneAndUpdate({ _id: mongodbGameId }, { $inc: { givenAnswers: 1 } }, { returnOriginal: false });
        if (updatedGame) {
            const statusCheck = () => {
                const fetchedData = updatedGame.value;
                if (fetchedData.questionsTotalNumber === fetchedData.givenAnswers) {
                    return false; // Game is finished
                }
                else {
                    return true; // Game should continue
                }
            };
            LocalDataStorage_1.default.updateLocalGameStatus(roomId, statusCheck());
        }
    }
    catch (e) {
        console.log(e);
        throw new Error('Update failed...');
    }
};
exports.default = gameUpdate;
