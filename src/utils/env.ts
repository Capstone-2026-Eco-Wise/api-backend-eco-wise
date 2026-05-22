import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number('PORT must be a valid number'),
  HOST: z.string('HOST must be a valid string'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  ORIGIN_ALLOWED: z.url('ORIGIN_ALLOWED must be a valid URL'),
  REDIS_URL: z.url('REDIS_URL must be a valid URL'),
  REDIS_DATABASE: z.coerce.number('REDIS_DATABASE must be a valid number'),
  DATABASE_URL: z.url('DATABASE_URL must be a valid URL'),
  DIRECT_URL: z.url('DIRECT_URL must be a valid URL'),
  SUPABASE_URL: z.url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string('SUPABASE_ANON_KEY must be a valid string'),
  SUPABASE_JWT_SECRET: z.string('SUPABASE_JWT_SECRET must be a valid string'),
  AI_API_URL: z.url('AI_API_URL must be a valid string'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:');
  console.error(_env.error.issues);
  process.exit(1);
}

export const env = _env.data;
