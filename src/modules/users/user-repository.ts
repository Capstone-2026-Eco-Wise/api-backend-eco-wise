import { prisma } from '../../infrastructure/database/prisma-client.ts';
import type { UserUpdateAvatarUrlType } from './user-type.ts';

export default class UserRepository {
  updateAvatarUser = async ({ id, avatarUrl }: UserUpdateAvatarUrlType) => {
    return await prisma.users.update({
      where: {
        id,
      },
      data: {
        avatar_url: avatarUrl,
      },
    });
  };
}
