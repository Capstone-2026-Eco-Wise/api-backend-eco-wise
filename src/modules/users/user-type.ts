import type { ROLE_USER, Users } from '../../../generated/prisma/client.ts';

type UpdateDataUserType = {
  id: string;
  fullName: string;
  role: ROLE_USER;
  avatarUrl: string | null;
  aiTokens: number;
  tokenResetAt: Date;
};

export type UserUpdateAvatarType = {
  user: Users;
  file: Express.Multer.File;
};

export type UpdateTokenUserType = Pick<UpdateDataUserType, 'id' | 'aiTokens'>;

export type UpdateAvatarUserType = Pick<UpdateDataUserType, 'id' | 'avatarUrl'>;

export type UpdateProfileUserType = Pick<UpdateDataUserType, 'id' | 'fullName'>;

export type UpdateRoleUserType = Pick<UpdateDataUserType, 'id' | 'role'>;

export type QueryParamUserType = {
  id: string;
  page: number;
  limit: number;
  search: string;
  role: ROLE_USER;
};
