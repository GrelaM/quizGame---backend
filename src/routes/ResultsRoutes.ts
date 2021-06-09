import { Router } from 'express';

import { singleGameResultsHandler } from '../game-singleplayer/controllers/ResultsController';

const router = Router();

router.get('/singlegame/:gameid', singleGameResultsHandler);

export default router
