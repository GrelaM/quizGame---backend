"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoHandler = exports.questionUpdateHandler = void 0;
const mongodb_1 = require("../database/mongodb");
const mongodb_2 = require("mongodb");
const updateQuestionsHandler_1 = __importDefault(require("../function/updateQuestionsHandler"));
const LocalSettingsStorage_1 = __importDefault(require("../data/LocalSettingsStorage"));
const questionUpdateHandler = (req, res, next) => {
    const update = async () => {
        await updateQuestionsHandler_1.default();
    };
    update()
        .then(() => {
        res.status(200).json({
            message: 'This is your info'
        });
    })
        .catch((err) => console.log(err));
};
exports.questionUpdateHandler = questionUpdateHandler;
const infoHandler = (req, res, next) => {
    const db = mongodb_1.getDb();
    const settingsCollectionId = LocalSettingsStorage_1.default.databaseSettingsCollectionId;
    const infoId = new mongodb_2.ObjectId(settingsCollectionId);
    db.collection('settings')
        .findOne({ _id: infoId })
        .then((info) => {
        res.status(200).json({
            message: 'This is your info',
            data: info
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong...'
        });
    });
};
exports.infoHandler = infoHandler;
