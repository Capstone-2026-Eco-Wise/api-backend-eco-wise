import type { ROLE_USER, Users } from '../../../generated/prisma/client.ts';

type UpdateDataUserType = {
  id: string;
  fullName: string;
  role: ROLE_USER;
  avatarUrl: string | null;
};

export type UserUpdateAvatarType = {
  user: Users;
  file: Express.Multer.File;
};

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
