"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Settings {
    constructor() {
        this.questionCollectionId = '608b1f9d79f5ba08bc313a8b';
        this.questions = {
            english: null
        };
    }
    saveQuestionCollectionId(id, collectionName) {
        if (collectionName === 'english') {
            this.questionCollectionId = id;
        }
    }
    saveQuestionSet(data) {
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
}
exports.default = Settings;
