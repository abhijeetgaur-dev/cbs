import { Router } from 'express';
import { getLiveContent } from '../controllers/broadcast.controller.js';

const router = Router();


router.get('/live/:teacherId', getLiveContent);

export default router;
