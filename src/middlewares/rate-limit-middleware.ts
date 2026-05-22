import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import RedisClient from '../infrastructure/cache/redis-client.ts';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  store: new RedisStore({
    sendCommand: async (...args: string[]) => {
      const redis = RedisClient.getInstance();
      await redis.connect();
      return redis.getClient().sendCommand(args);
    },
  }),
});
