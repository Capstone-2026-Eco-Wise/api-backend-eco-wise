import { createClient, type RedisClientType } from 'redis';
import { env } from '../../utils/env.ts';

export default class RedisClient {
  private static instance: RedisClient;
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient({
      socket: {
        host: env.REDIS_HOST,
        // port: Number(env.REDIS_PORT) || 6379,
      },
      database: Number(env.REDIS_DATABASE),
    });

    this.client.on('error', (error) => {
      console.error('[redis] client error:', error.message);
    });

    this.client.on('reconnecting', () => {
      console.warn('[redis] reconnecting...');
    });

    this.client.on('ready', () => {
      console.log('[redis] ready');
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }

    return RedisClient.instance;
  }

  async connect() {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
