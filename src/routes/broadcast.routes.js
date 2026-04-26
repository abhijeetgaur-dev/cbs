import { Router } from 'express';
import { getLiveContent } from '../controllers/broadcast.controller.js';
import { liveBroadcastLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();


router.get('/live/:teacherId', liveBroadcastLimiter, getLiveContent);

export default router;
