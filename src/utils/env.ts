import 'dotenv/config';
import { z } from 'zod';
import { logger } from '../infrastructure/logger/logger.ts';

const envSchema = z.object({
  PORT: z.string().default('3030'),
  HOST: z.string().default('localhost'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  ORIGIN_ALLOWED: z.string(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  REDIS_DATABASE: z.string().optional(),
  DATABASE_URL: z.url('DATABASE_URL must be a valid URL'),
  DIRECT_URL: z.url().optional(),
  SUPABASE_URL: z.url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  logger.error('❌ Invalid environment variables:', _env.error.issues);
  process.exit(1);
}

export const env = _env.data;
