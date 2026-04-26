import { z } from 'zod';

export const rejectSchema = z.object({
  rejection_reason: z.string().min(1, 'Rejection reason is required'),
});
