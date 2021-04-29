"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStorage = void 0;
class GameStorage {
    constructor() {
        this.totalGamesPlayed = 0;
        this.games = [];
        this.gamesId = [];
        this.questions = {
            english: []
        };
    }
    addNewGame(game) {
        this.games.push(game);
        this.totalGamesPlayed++;
        // console.log(this.games);
    }
    generateNewId() {
        const gameIdGeneretor = () => {
            const elNum = 6;
            let key = '#';
            for (let i = 0; i < elNum; i++) {
                let x = Math.floor(Math.random() * 10);
                key += x;
            }
            return String(key);
        };
        let newId = gameIdGeneretor();
        while (this.gamesId.includes(newId)) {
            newId = gameIdGeneretor();
        }
        this.gamesId.push(newId);
        return newId;
    }
    addQuestions(data) {
        this.questions.english = data;
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
    checkAnswerHandler(status, gameId) {
        const game = this.games.find((el) => el.gameId === gameId);
        if (status && game) {
            game.givenAnswers = game.givenAnswers + 1;
            game.points = game.points + 1;
        }
        else if (!status && game) {
            game.givenAnswers = game.givenAnswers + 1;
        }
        else {
            console.log(`Couldn't find this game...`);
        }
    }
}
exports.GameStorage = GameStorage;
