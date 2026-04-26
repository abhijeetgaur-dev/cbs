import rateLimit from 'express-rate-limit';

export const liveBroadcastLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per windowMs (1 req/sec average)
  message: {
    message: 'Too many broadcast requests from this IP, please try again later',
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});
