import type { User } from '@supabase/supabase-js';
import type { Users } from '../../generated/prisma/client.ts';

export type SessionUser = Pick<
  Users,
  'id' | 'fullName' | 'username' | 'email' | 'role' | 'avatar_url' | 'aiTokens'
>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      user?: SessionUser;
      supabase?: User;
    }
  }
}
