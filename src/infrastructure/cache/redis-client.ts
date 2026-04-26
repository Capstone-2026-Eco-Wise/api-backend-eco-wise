import { createClient, type RedisClientType } from 'redis';
import { env } from '../../utils/env.ts';
import { logger } from '../logger/logger.ts';

export default class RedisClient {
  private static instance: RedisClient;
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient({
      socket: {
        host: env.REDIS_HOST,
        port: Number(env.REDIS_PORT),
      },
      database: Number(env.REDIS_DATABASE),
    });

    this.client.on('error', (error) => {
      logger.error(`[redis] client error: ${error.message}`);
    });

    this.client.on('reconnecting', () => {
      logger.warn(`[redis] reconnecting...`);
    });

    this.client.on('ready', () => {
      logger.info(`[redis] ready`);
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }

    return RedisClient.instance;
  }

  connect = async () => {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
    }
  }

  disconnect = async () => {
    if (this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
