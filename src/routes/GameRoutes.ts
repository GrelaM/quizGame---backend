import { Router } from 'express';

import { startNewGame } from '../controllers/GameController';

const router = Router();

router.post('/newgame', startNewGame);

export default router;
