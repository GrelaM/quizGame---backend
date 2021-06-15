"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../../app");
const Sockets_1 = __importDefault(require("../../../constants/Sockets"));
const questionHandler = (data, roomId) => {
    const hostData = {
        roomId: data.game.roomId,
        timer: data.game.timer,
        questionsLeft: data.game.questionsTotalNumber - data.game.givenAnswers
    };
    const playerData = {
        roomId: data.game.roomId,
        timer: data.game.timer,
        questionNumber: data.game.givenAnswers + 1,
        totalQuestions: data.game.questionsTotalNumber
    };
    const currentQuestion = data.game.questions[data.game.givenAnswers];
    const mergedHints = [
        currentQuestion.Hint_1,
        currentQuestion.Hint_2,
        currentQuestion.Hint_3
    ];
    const answersArray = sortArrayHandler(currentQuestion.Correct, currentQuestion.Incorrect_1, currentQuestion.Incorrect_2, currentQuestion.Incorrect_3);
    const payload = {
        category: currentQuestion.Category,
        difficulty: currentQuestion.Difficulty,
        question: currentQuestion.Question,
        hints: mergedHints,
        answers: answersArray
    };
    app_1.io.to(roomId).emit(Sockets_1.default.QUESTION, {
        host: hostData,
        playerData: playerData,
        questionUpdate: payload
    });
};
exports.default = questionHandler;
// HANDLERS
const sortArrayHandler = (correct, incorrect_1, incorrect_2, incorrect_3) => {
    const primaryArray = [
        { code: 0, value: correct },
        { code: 1, value: incorrect_1 },
        { code: 2, value: incorrect_2 },
        { code: 3, value: incorrect_3 }
    ];
    const shuffeledArray = primaryArray.sort(() => Math.random() - 0.5);
    return shuffeledArray;
};
