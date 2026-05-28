import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import RedisClient from '../infrastructure/cache/redis-client.ts';
import { env } from '../utils/env.ts';

export const authLimiter = rateLimit({
  windowMs: env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 1000,
  limit: env.NODE_ENV === 'production' ? 5 : 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  store: new RedisStore({
    sendCommand: async (...args: string[]) => {
      const redis = RedisClient.getInstance();
      await redis.connect();
      return redis.getClient().sendCommand(args);
    },
  }),
});
