import app from './app.ts';
import RedisClient from './infrastructure/cache/redis-client.ts';
import { logger } from './infrastructure/logger/logger.ts';
import { env } from './utils/env.ts';

const startServer = async () => {
  try {
    const redis = RedisClient.getInstance();
    await redis.connect();

    app.listen(env.PORT, () => {
      logger.info(`Server is running on http://${env.HOST}:${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
