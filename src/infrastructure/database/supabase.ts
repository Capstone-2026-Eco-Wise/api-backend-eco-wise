import { createClient } from '@supabase/supabase-js';
import { env } from '../../utils/env.ts';

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
