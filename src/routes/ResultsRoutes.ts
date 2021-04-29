import { Router } from 'express';

import { singleGameResultsHandler } from '../controllers/ResultsController';

const router = Router();

router.get('/singlegame/:gameid', singleGameResultsHandler);

export default router
