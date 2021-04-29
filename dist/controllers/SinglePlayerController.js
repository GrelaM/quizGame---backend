"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleGameAnswerHandler = exports.singleGameQuestionHandler = void 0;
const GamesStorage_1 = require("../data/GamesStorage");
const singleGameQuestionHandler = (req, res, next) => {
    const singleGame = findAndReturnGameHandler(req.params.gameid);
    if (singleGame) {
        const question = singleGame.questions[singleGame.givenAnswers];
        let hintsArray = [];
        hintsArray.push(question.Hint_1, question.Hint_2, question.Hint_3);
        let status = true;
        if (singleGame.givenAnswers === singleGame.totalQuestionNumber - 1) {
            status = false;
        }
        const answersSortedArray = sortArrayHandler(question.Correct, question.Incorrect_1, question.Incorrect_2, question.Incorrect_3);
        const data = {
            category: question.Category,
            questionNumber: singleGame.givenAnswers + 1,
            question: question.Question,
            hints: hintsArray,
            answers: answersSortedArray,
            gameStatus: status
        };
        res.status(200).json({
            question: data
        });
    }
    else {
        res.status(404).json({
            error: 'This game does not exist!'
        });
    }
};
exports.singleGameQuestionHandler = singleGameQuestionHandler;
const singleGameAnswerHandler = (req, res, next) => {
    const id = req.params.gameid;
    const singleGame = findAndReturnGameHandler(id);
    const currentQuestionObjIndex = +req.params.question;
    if (singleGame) {
        const answer = req.body;
        const currentCorrectAnswer = singleGame.questions[currentQuestionObjIndex].Correct;
        let status;
        if (answer.code === 0 && answer.value === currentCorrectAnswer) {
            status = true;
            GamesStorage_1.gamesStorage.checkAnswerHandler(status, id);
        }
        else {
            status = false;
            GamesStorage_1.gamesStorage.checkAnswerHandler(status, id);
        }
        res.status(202).send({
            message: 'Answer was accepted!',
            status: true
        });
    }
    else {
        res.status(404).json({
            error: 'Counld not check the answer. This game does not exist!'
        });
    }
};
exports.singleGameAnswerHandler = singleGameAnswerHandler;
// HANDLERS
const findAndReturnGameHandler = (id) => {
    const singleGame = GamesStorage_1.gamesStorage.games.find((el) => el.gameId === id);
    return singleGame;
};
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
// VALIDATION OF BODY???
