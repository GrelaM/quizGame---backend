"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../database/mongodb");
class LocalSettingsStorage {
    constructor() {
        ;
        (this.databaseSettingsCollectionId = ''), (this.artificialGameIds = []);
    }
    saveCollectionId(solidId) {
        this.databaseSettingsCollectionId = solidId;
    }
    saveArtificialGameIds(id) {
        this.artificialGameIds.push(id);
    }
    deleteArtificialGameIds(id) {
        const idIndex = this.artificialGameIds.indexOf(id);
        if (idIndex > -1) {
            this.artificialGameIds.splice(idIndex, 0);
        }
    }
    setUpSettingsCollection() {
        const settingsObj = {
            requestedSinglePlayer: 0,
            finishedSinglePlayer: 0,
            requestedMultiplayer: 0,
            finishedMutliplayer: 0,
            lastQuestionUpdate: ''
        };
        const db = mongodb_1.getDb();
        return db
            .listCollections({ name: 'settings' })
            .toArray()
            .then((collection) => {
            if (collection.length === 0) {
                db.collection('settings')
                    .insertOne(settingsObj)
                    .then((res) => {
                    const documentId = res.ops[0]._id;
                    this.saveCollectionId(documentId);
                })
                    .catch((err) => console.log(err));
            }
            else {
                db.collection('settings')
                    .find()
                    .toArray()
                    .then((document) => {
                    const documentId = document[0]._id;
                    this.saveCollectionId(documentId);
                })
                    .catch((err) => console.log(err));
            }
        })
            .catch((err) => console.log(err));
    }
}
exports.default = LocalSettingsStorage;
