import { Router } from 'express';
import { upload as uploadController, myContent } from '../controllers/content.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadSchema } from '../validators/content.validators.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { uploadMiddleware } from '../middlewares/upload.middleware.js';

const router = Router();

// Only teachers can upload and view multiple personal contents
router.use(authMiddleware, requireRole('teacher'));

router.post('/upload', uploadMiddleware, validate(uploadSchema), uploadController);
router.get('/my', myContent);

export default router;
