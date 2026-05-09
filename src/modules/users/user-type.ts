import type { Users } from '../../../generated/prisma/client.ts';

export type UserUpdateAvatarType = {
  user: Users;
  file: Express.Multer.File;
};

export type UserUpdateAvatarUrlType = {
  id: string;
  avatarUrl: string | null;
};
