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
  fullName: string;
  email: string;
  password: string;
  username: string;
};

export type UserSignInType = Omit<UserSignUpType, 'fullName' | 'username'>;

export type UserUpdateAvatarType = {
  user: Users;
  file: Express.Multer.File;
};
