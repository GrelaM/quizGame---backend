"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GameController_1 = require("../controllers/GameController");
const router = express_1.Router();
router.get('/newgame', GameController_1.startNewGame);
exports.default = router;
