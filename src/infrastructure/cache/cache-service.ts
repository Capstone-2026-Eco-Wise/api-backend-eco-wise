import type { RedisClientType } from 'redis';
import { logger } from '../logger/logger.ts';
import RedisClient from './redis-client.ts';

export default class CacheService {
  private redisClient: RedisClientType;

  constructor() {
    const redisInstance = RedisClient.getInstance();
    this.redisClient = redisInstance.getClient();
  }

  get = async (key: string) => {
    try {
      logger.info(`[cache] get key: ${key}`);
      const data = await this.redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`[cache] get failed for key ${key}: ${(error as Error).message}`);
      return null;
    }
  };

  set = async (key: string, value: unknown, ttl: number = 3600) => {
    try {
      logger.info(`[cache] set key: ${key}, ttl: ${ttl}`);
      return await this.redisClient.set(key, JSON.stringify(value), { EX: ttl });
    } catch (error) {
      logger.error(`[cache] set failed for key ${key}: ${(error as Error).message}`);
      return null;
    }
  };

  del = async (key: string) => {
    try {
      logger.info(`[cache] del key: ${key}`);
      return await this.redisClient.del(key);
    } catch (error) {
      logger.error(`[cache] del failed for key ${key}: ${(error as Error).message}`);
      return null;
    }
  };
}
