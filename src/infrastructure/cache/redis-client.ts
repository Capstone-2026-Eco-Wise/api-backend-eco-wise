import { createClient, type RedisClientType } from 'redis';
import { env } from '../../utils/env.ts';
import { logger } from '../logger/logger.ts';

export default class RedisClient {
  private static instance: RedisClient;
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient({
      url: env.REDIS_URL as string,
      pingInterval: 0,
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

  private connectPromise: Promise<void> | null = null;

  connect = async () => {
    if (this.isConnected) return;

    if (!this.connectPromise) {
      this.connectPromise = this.client
        .connect()
        .then(() => {
          this.isConnected = true;
        })
        .catch((err) => {
          this.connectPromise = null;
          throw err;
        });
    }
    return this.connectPromise;
  };

  disconnect = async () => {
    if (this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  };

  getClient(): RedisClientType {
    return this.client;
  }
}
