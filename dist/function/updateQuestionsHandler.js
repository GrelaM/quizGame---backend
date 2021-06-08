"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const mongodb_1 = require("../database/mongodb");
const LocalSettingsStorage_1 = __importDefault(require("../data/LocalSettingsStorage"));
const mongodb_2 = require("mongodb");
const Collections_1 = __importDefault(require("../constants/Collections"));
const xlsx = require('xlsx');
const fs = require('fs');
const filePath = path_1.default.resolve(__dirname, '../data/questions/Data.xlsx');
const questionsFile = xlsx.readFile(filePath);
const questionsInEnglish = questionsFile.Sheets['Questions'];
const data = xlsx.utils.sheet_to_json(questionsInEnglish);
const timeStamp = () => {
    // const oneHour = 60 * 60 * 1000
    const fiveMinutes = 5 * 60 * 1000;
    const newStamp = new Date().getTime() - fiveMinutes;
    return newStamp;
};
const dbQuestionUpdate = async () => {
    const db = mongodb_1.getDb();
    const settingsCollectionId = new mongodb_2.ObjectId(LocalSettingsStorage_1.default.databaseSettingsCollectionId);
    try {
        await db.collection(Collections_1.default.QUESTIONS).drop();
        await data.forEach((el) => {
            db.collection(Collections_1.default.QUESTIONS).insertOne(el);
        });
        await db
            .collection(Collections_1.default.SETTINGS)
            .updateOne({ _id: settingsCollectionId }, { $set: { lastQuestionUpdate: new Date() } });
        console.log('Questions were updated!');
    }
    catch (e) {
        console.log(e);
    }
};
const updateQuestionHandler = () => {
    fs.stat(filePath, (err, stats) => {
        if (err) {
            throw err;
        }
        else if (stats.mtime > timeStamp()) {
            console.log('I should update questions collection...');
            dbQuestionUpdate();
        }
        else {
            console.log('Question collection is up to date...');
        }
    });
};
exports.default = updateQuestionHandler;
