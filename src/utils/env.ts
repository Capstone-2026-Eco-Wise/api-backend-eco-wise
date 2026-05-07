import 'dotenv/config';
import { z } from 'zod';
import { logger } from '../infrastructure/logger/logger.ts';

const envSchema = z.object({
  PORT: z.string(),
  HOST: z.string(),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  ORIGIN_ALLOWED: z.string(),
  REDIS_URL: z.string(),
  REDIS_DATABASE: z.string(),
  DATABASE_URL: z.url('DATABASE_URL must be a valid URL'),
  DIRECT_URL: z.url(),
  SUPABASE_URL: z.url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  AI_API_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  logger.error('❌ Invalid environment variables:', _env.error.issues);
  process.exit(1);
}

export const env = _env.data;
