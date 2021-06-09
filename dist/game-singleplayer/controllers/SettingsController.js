"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoHandler = exports.questionUpdateHandler = void 0;
const mongodb_1 = require("../../database/mongodb");
const mongodb_2 = require("mongodb");
const Collections_1 = __importDefault(require("../../constants/Collections"));
const updateQuestionsHandler_1 = __importDefault(require("../../function/updateQuestionsHandler"));
const LocalSettingsStorage_1 = __importDefault(require("../../data/LocalSettingsStorage"));
const questionUpdateHandler = async (req, res, next) => {
    try {
        await updateQuestionsHandler_1.default();
        res.status(200).json({
            message: 'Question collection has been updated successfully!'
        });
    }
    catch (e) {
        res.status(500).json({
            message: 'Server faced some issues. Please try again later...'
        });
    }
};
exports.questionUpdateHandler = questionUpdateHandler;
const infoHandler = async (req, res, next) => {
    const db = mongodb_1.getDb();
    const settingsCollectionId = LocalSettingsStorage_1.default.databaseSettingsCollectionId;
    const infoId = new mongodb_2.ObjectId(settingsCollectionId);
    try {
        const fetchedInfo = await db.collection(Collections_1.default.SETTINGS).findOne({ _id: infoId });
        res.status(200).json({
            message: 'Game data have been fetched seccussfully!',
            data: fetchedInfo
        });
    }
    catch (e) {
        res.status(500).json({
            message: 'Server faced some issues. Please try again later...'
        });
    }
};
exports.infoHandler = infoHandler;
