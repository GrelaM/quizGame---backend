import { QuestionObject } from '../constants/Interfaces';

export class Game {
	gameId: string;
	totalQuestionNumber: number;
	questions: QuestionObject[];
	givenAnswers: number;
	points: number;
	gameStatus: boolean;
	timer: number;
	establishedAt: Date;

	constructor(
		id: string,
		totalNum: number,
		questions: QuestionObject[],
		givenAnswers: number,
		points: number,
		status: boolean,
		timer: number,
		establishedDate: Date
	) {
		this.gameId = id;
		this.totalQuestionNumber = totalNum;
		this.questions = questions;
		this.givenAnswers = givenAnswers;
		this.points = points;
		this.gameStatus = status;
		this.timer = timer;
		this.establishedAt = establishedDate;
	}
}
