import { RequestHandler } from 'express';

import { gamesStorage } from '../data/GamesStorage';

export const singleGameQuestionHandler: RequestHandler = (req, res, next) => {
	const singleGame = findAndReturnGameHandler(req.params.gameid);

	if (singleGame) {
		const question = singleGame.questions[singleGame.givenAnswers];
		let hintsArray: string[] = [];
		hintsArray.push(question.Hint_1, question.Hint_2, question.Hint_3);

		let status = true;
		if (singleGame.givenAnswers === singleGame.totalQuestionNumber - 1) {
			status = false;
		}

		const answersSortedArray = sortArrayHandler(
			question.Correct,
			question.Incorrect_1,
			question.Incorrect_2,
			question.Incorrect_3
		);

		const data = {
			category: question.Category,
			questionNumber: singleGame.givenAnswers + 1, // Answers begin with 0...
			question: question.Question,
			hints: hintsArray,
			answers: answersSortedArray,
            gameStatus: status
		};

		res.status(200).json({
			question: data
		});
	} else {
		res.status(404).json({
			error: 'This game does not exist!'
		});
	}
};

export const singleGameAnswerHandler: RequestHandler = (req, res, next) => {
	const id = req.params.gameid;
	const singleGame = findAndReturnGameHandler(id);
	const currentQuestionObjIndex = +req.params.question;

	if (singleGame) {
		const answer: {
			code: number;
			value: string;
		} =
			req.body;

		const currentCorrectAnswer = singleGame.questions[currentQuestionObjIndex].Correct;

		let status: boolean;
		if (answer.code === 0 && answer.value === currentCorrectAnswer) {
			status = true;
			gamesStorage.checkAnswerHandler(status, id);
		} else {
			status = false;
			gamesStorage.checkAnswerHandler(status, id);
		}

		res.status(202).send({
			message: 'Answer was accepted!',
			status: true
		});
	} else {
		res.status(404).json({
			error: 'Counld not check the answer. This game does not exist!'
		});
	}
};

// HANDLERS

const findAndReturnGameHandler = (id: string) => {
	const singleGame = gamesStorage.games.find((el) => el.gameId === id);
	return singleGame;
};

const sortArrayHandler = (correct: string, incorrect_1: string, incorrect_2: string, incorrect_3: string) => {
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
