import type { User } from '@supabase/supabase-js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      user?: User;
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
