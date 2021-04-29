import { RequestHandler } from 'express'

import { gamesStorage } from '../data/GamesStorage';

export const singleGameResultsHandler: RequestHandler = (req, res, next) => {
    const singleGame = findAndReturnGameHandler(req.params.gameid)

    if(singleGame) {
        const points = singleGame.points
        const questions = singleGame.totalQuestionNumber
        res.status(200).json({
			message: 'This game is ended!',
            points: points,
            maxPoints: questions
		});
    } else {
        res.status(404).json({
			error: 'This game does not exist!'
		});
    }
}

// HANDLERS

const findAndReturnGameHandler = (id: string) => {
	const singleGame = gamesStorage.games.find((el) => el.gameId === id);
	return singleGame;
};
