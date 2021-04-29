import express from 'express';

const router = express.Router();

import * as Handler from '../controllers/SinglePlayerController'

router.get('/game/:gameid', Handler.singleGameQuestionHandler)

router.post('/game/:gameid/question/:question', Handler.singleGameAnswerHandler)

export default router;
