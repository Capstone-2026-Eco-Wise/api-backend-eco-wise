import type { RedisClientType } from 'redis';
import { logger } from '../logger/logger.ts';
import RedisClient from './redis-client.ts';

export default class CacheService {
  private redisClient: RedisClientType;

  constructor() {
    const redisInstance = RedisClient.getInstance();
    this.redisClient = redisInstance.getClient();
  }

  async get(key: string) {
    logger.info(`[cache] get key: ${key}`);

    const data = await this.redisClient.get(key);

    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: unknown, ttl: number = 3600) {
    logger.info(`[cache] set key: ${key}, ttl: ${ttl}`);

    return await this.redisClient.set(key, JSON.stringify(value), { EX: ttl });
  }

  async del(key: string) {
    logger.info(`[cache] del key: ${key}`);

    return await this.redisClient.del(key);
  }
}
