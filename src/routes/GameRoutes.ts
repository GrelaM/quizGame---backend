import { Router } from 'express';

import * as Handler from '../controllers/GameController';

const router = Router();

router.post('/newgame', Handler.startNewGame) 

router.get('/:gameid/recoveryprocess', Handler.singlePlayerRecoveryMode)

router.post('/newgame/multiplayer', Handler.startNewMultiPlayerGame)

router.get('/multiplayer/:gameid/recoveryprocess', Handler.multiplayerRecoveryMode)

export default router;
