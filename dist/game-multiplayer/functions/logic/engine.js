"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine = (ms, localGameStatus) => new Promise((resolve) => {
    const engineTimer = (ms * 1000) + 1000; // SHOULD IT BE?!
    const timer = setTimeout(() => {
        resolve(true);
        clearTimeout(timer);
        clearInterval(answerLengthCheck);
    }, engineTimer);
    const answerLengthCheck = setInterval(() => {
        if (localGameStatus.players.length === localGameStatus.receivedAnswers) {
            resolve(true);
            clearTimeout(timer);
            clearInterval(answerLengthCheck);
        }
    }, 200);
});
exports.default = engine;
