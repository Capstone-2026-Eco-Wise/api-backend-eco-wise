import 'dotenv/config';

export const env = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ORIGIN_ALLOWED: process.env.ORIGIN_ALLOWED,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_DATABASE: process.env.REDIS_DATABASE,
};
