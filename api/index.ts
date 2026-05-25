import app from '../src/app.ts';
import RedisClient from '../src/infrastructure/cache/redis-client.ts';
import { logger } from '../src/infrastructure/logger/logger.ts';

// Initialize Redis for Vercel Serverless environment
const redis = RedisClient.getInstance();
redis.connect().catch((err) => {
  logger.error('Failed to connect to Redis in Vercel Serverless:', err);
});

// Export the Express API
export default app;
