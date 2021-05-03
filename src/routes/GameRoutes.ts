import { Router } from 'express';

import { startNewGame } from '../controllers/GameController';

const router = Router();

router.get('/newgame', startNewGame);

export default router;
