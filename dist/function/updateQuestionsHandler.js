"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const mongodb_1 = require("../database/mongodb");
const LocalSettingsStorage_1 = __importDefault(require("../data/LocalSettingsStorage"));
const mongodb_2 = require("mongodb");
const xlsx = require('xlsx');
const fs = require('fs');
const filePath = path_1.default.resolve(__dirname, '../data/questions/Data.xlsx');
const questionsFile = xlsx.readFile(filePath);
const questionsInEnglish = questionsFile.Sheets['Questions'];
const data = xlsx.utils.sheet_to_json(questionsInEnglish);
const updateQuestionHandler = () => {
    const timeStamp = () => {
        // const oneHour = 60 * 60 * 1000
        const fiveMinutes = 1 * 60 * 1000;
        const newStamp = new Date().getTime() - fiveMinutes;
        return newStamp;
    };
    fs.stat(filePath, (err, stats) => {
        if (err) {
            throw err;
        }
        else if (stats.mtime > timeStamp()) {
            console.log('I should update questions collection...');
            const db = mongodb_1.getDb();
            return db
                .collection('questions')
                .drop()
                .then(() => {
                data.forEach((el) => {
                    return db
                        .collection('questions')
                        .insertOne(el)
                        .catch((err) => console.log(err));
                });
            })
                .then(() => {
                const settingsCollectionId = new mongodb_2.ObjectId(LocalSettingsStorage_1.default.databaseSettingsCollectionId);
                db.collection('settings')
                    .updateOne({ _id: settingsCollectionId }, { $set: { "lastQuestionUpdate": new Date() } })
                    .catch(err => console.log(err));
            })
                .then(() => console.log('Questions were updated!'))
                .catch((err) => console.log(err));
        }
        else {
            console.log('Question collection is up to date...');
        }
    });
};
exports.default = updateQuestionHandler;
