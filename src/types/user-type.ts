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

export type UserSignUpType = {
  full_name: string;
  email: string;
  password: string;
  username: string;
};

export type UserSignInType = {
  email: string;
  password: string;
};
