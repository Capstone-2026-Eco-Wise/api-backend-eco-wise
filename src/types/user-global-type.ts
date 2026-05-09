import type { User } from '@supabase/supabase-js';
import type { Users } from '../../generated/prisma/client.ts';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      user?: Users;
      supabase?: User;
    }
  }
}
