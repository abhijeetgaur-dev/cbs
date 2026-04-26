import { Router } from 'express';
import { getPending, getAll, approve, reject } from '../controllers/approval.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { rejectSchema } from '../validators/approval.validators.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

// Only principals can perform approval actions
router.use(authMiddleware, requireRole('principal'));

router.get('/pending', getPending);
router.get('/all', getAll);
router.patch('/:contentId/approve', approve);
router.patch('/:contentId/reject', validate(rejectSchema), reject);

export default router;
