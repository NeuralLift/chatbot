import { rateLimit } from 'express-rate-limit';

import appConfig from './app';

export const limiter = rateLimit({
  windowMs: parseInt(appConfig.RATE_TIME_LIMIT) * 60 * 1000,
  limit: parseInt(appConfig.RATE_REQUEST_LIMIT), // Limit each IP to {limit} requests per `window` (here, per {time} minutes).
  standardHeaders: 'draft-8',
});
