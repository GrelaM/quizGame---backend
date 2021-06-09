"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ResultsController_1 = require("../game-singleplayer/controllers/ResultsController");
const router = express_1.Router();
router.get('/singlegame/:gameid', ResultsController_1.singleGameResultsHandler);
exports.default = router;
