import { Game } from './Game';
import { QuestionObject } from '../constants/Interfaces';

export class GameStorage {
	totalGamesPlayed: number;
	games: Game[];
	gamesId: string[];
	questions: {
		english: QuestionObject[];
	};

	constructor() {
		this.totalGamesPlayed = 0;
		this.games = [];
		this.gamesId = [];
		this.questions = {
			english: []
		};
	}

	addNewGame(game: Game) {
		this.games.push(game);
		this.totalGamesPlayed++;
		// console.log(this.games);
	}

	generateNewId() {
		const gameIdGeneretor = () => {
			const elNum: number = 6;
			let key: string = '#';
			for (let i = 0; i < elNum; i++) {
				let x = Math.floor(Math.random() * 10);
				key += x;
			}
			return String(key);
		};

		let newId: string = gameIdGeneretor();

		while (this.gamesId.includes(newId)) {
			newId = gameIdGeneretor();
		}
		this.gamesId.push(newId);
		return newId;
	}

	addQuestions(data: QuestionObject[]) {
		this.questions.english = data;
	}

	getQuestionsPackage(rounds: number) {
		let questions: QuestionObject[] = this.questions.english;
		let questionsPackage: QuestionObject[] = [];

		for (let i = 0; i < rounds; i++) {
			const questionsAmount: number = questions.length;
			const random = Math.floor(Math.random() * questionsAmount);
			questionsPackage.push(questions[random]);
			questions.slice(random, 1);
		}
		return questionsPackage;
	}

	checkAnswerHandler(status: boolean, gameId: string) {
		const game = this.games.find((el) => el.gameId === gameId);

		if (status && game) {
			game.givenAnswers = game.givenAnswers + 1;
			game.points = game.points + 1;
		} else if (!status && game) {
			game.givenAnswers = game.givenAnswers + 1;
		} else {
			console.log(`Couldn't find this game...`)
		}
	}
}
