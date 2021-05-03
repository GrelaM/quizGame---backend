"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../database/mongodb");
class LocalSettingsStorage {
    constructor() {
        ;
        (this.databaseSettingsCollectionId = ''), (this.atrificialGameIds = []);
    }
    saveCollectionId(id) {
        this.databaseSettingsCollectionId = id;
    }
    setUpSettingsCollection() {
        const settingsObj = {
            requestedSinglePlayer: 0,
            playedSinglePlayer: 0,
            requestedMultiplayer: 0,
            playedMutliplayer: 0,
            lastQuestionUpdate: ''
        };
        const db = mongodb_1.getDb();
        db.listCollections({ name: 'settings' })
            .toArray()
            .then((collection) => {
            if (collection) {
                db.collection('settings')
                    .find()
                    .toArray()
                    .then((document) => {
                    const documentId = document[0]._id;
                    this.saveCollectionId(documentId);
                })
                    .catch((err) => console.log(err));
            }
            else {
                db.collection('settings')
                    .insertOne(settingsObj)
                    .then((res) => {
                    console.log(res);
                })
                    .catch((err) => console.log(err));
            }
        })
            .catch((err) => console.log(err));
    }
}
exports.default = LocalSettingsStorage;
