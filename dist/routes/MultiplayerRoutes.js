"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MultiplayerController_1 = require("../controllers/MultiplayerController");
const router = express_1.Router();
router.get('/room/:roomid', MultiplayerController_1.multiplayerController);
exports.default = router;
