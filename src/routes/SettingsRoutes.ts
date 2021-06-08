import { Router } from 'express';
import * as settings from '../game-singleplayer/controllers/SettingsController'

const router = Router();

router.get('/questionupdate', settings.questionUpdateHandler);

router.get('/info', settings.infoHandler)

export default router;
