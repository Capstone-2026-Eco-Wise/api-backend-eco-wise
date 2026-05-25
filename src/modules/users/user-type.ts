import type { ROLE_USER, users } from '../../../generated/prisma/client.ts';

type PayloadDataUsersType = {
  id: string;
  fullName: string;
  role: ROLE_USER;
  avatarUrl: string | null;
  aiTokens: number;
  tokenResetAt: Date;
};

export type UserUpdateAvatarType = {
  user: users;
  file: Express.Multer.File;
};

export type UpdateTokenUserType = Pick<PayloadDataUsersType, 'id' | 'aiTokens'>;

export type UpdateAvatarUserType = Pick<
  PayloadDataUsersType,
  'id' | 'avatarUrl'
>;

export type UpdateProfileUserType = Pick<
  PayloadDataUsersType,
  'id' | 'fullName'
>;

export type UpdateRoleUserType = Pick<PayloadDataUsersType, 'id' | 'role'>;

export type ResetTokenUserType = Pick<PayloadDataUsersType, 'id'> & {
  nextReset: Date;
};

export type QueryParamUserType = {
  id: string;
  page: number;
  limit: number;
  search: string;
  role: ROLE_USER;
};
