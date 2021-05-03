"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStorage = void 0;
const mongodb_1 = require("../database/mongodb");
const idGenerator_1 = __importDefault(require("../function/idGenerator"));
// import { ObjectId } from 'mongodb'
// { _id: new ObjectId('608afd572ddb3c25c063208e') }
class GameStorage {
    constructor() {
        this.totalGamesPlayed = 0;
        this.games = [];
        this.gamesId = [];
        this.questions = {
            english: []
        };
    }
    saveNewGame(game) {
        const db = mongodb_1.getDb();
        return db
            .collection('storage')
            .insertOne(game)
            .then((result) => console.log('Game has been added...'))
            .catch((err) => console.log(err));
    }
    addNewGame(game) {
        this.games.push(game);
        this.totalGamesPlayed++;
    }
    generateNewId() {
        const db = mongodb_1.getDb();
        return db
            .collection('idCollection')
            .find()
            .toArray()
            .then((collection) => {
            let newId = idGenerator_1.default(6);
            while (collection.includes(newId)) {
                newId = idGenerator_1.default(6);
            }
            db.collection('idCollection')
                .insertOne({ gameId: newId })
                .then((result) => {
                // console.log(result.ops[0]._id) // _id of gameId string!!!
                console.log('Game ID has been created!!!');
            })
                .catch((err) => {
                console.log(err);
            });
            return newId;
        })
            .catch((err) => console.log(err));
    }
    addQuestions(data) {
        this.questions.english = data;
        // const db = getDb()
        // return db.collection('questions')
        // .drop()
        // .then(() => {
        // 	db.collection('questions')
        // 	.insertOne({english: data})
        // 	.then(res => {
        // 		console.log('Question database was updated...')
        // 		console.log(res.ops[0]._id)
        // 	})
        // 	.catch(err => console.log(err))
        // })
        // .catch(err => console.log(err))
    }
    getQuestionsPackage(rounds) {
        let questions = this.questions.english;
        let questionsPackage = [];
        for (let i = 0; i < rounds; i++) {
            const questionsAmount = questions.length;
            const random = Math.floor(Math.random() * questionsAmount);
            questionsPackage.push(questions[random]);
            questions.slice(random, 1);
        }
        return questionsPackage;
    }
}
exports.GameStorage = GameStorage;
