import { Router } from 'express';

import { startNewGame } from '../controllers/GameController';

import { gamesStorage } from '../data/GamesStorage'

const router = Router();

router.get('/newgame', startNewGame);

router.get('/checkfile', (req,res,next) => {
    res.status(200).json({
        message: 'Complete data...',
        timestamp: new Date(),
        timer: 3,
        data: gamesStorage
    })
})

export default router;
