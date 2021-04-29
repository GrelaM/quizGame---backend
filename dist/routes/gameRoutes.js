"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GameController_1 = require("../controllers/GameController");
const GamesStorage_1 = require("../data/GamesStorage");
const router = express_1.Router();
router.get('/newgame', GameController_1.startNewGame);
router.get('/checkfile', (req, res, next) => {
    res.status(200).json({
        message: 'Complete data...',
        timestamp: new Date(),
        timer: 3,
        data: GamesStorage_1.gamesStorage
    });
});
exports.default = router;
