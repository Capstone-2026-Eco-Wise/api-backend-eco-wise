import type { Prisma } from '../../../generated/prisma/client.ts';
import { prisma } from '../../infrastructure/database/prisma-client.ts';
import type {
  QueryParamUserType,
  UpdateAvatarUserType,
  UpdateProfileUserType,
  UpdateRoleUserType,
} from './user-type.ts';

export default class UserRepository {
  getAllUsers = async ({
    id,
    page = 1,
    limit = 10,
    role,
    search,
  }: QueryParamUserType) => {
    const where: Prisma.UsersWhereInput = {
      ...(id && { id: { not: id } }),
      ...(role !== undefined && { role }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
    const include: Prisma.UsersInclude = {
      ecoPoints: {
        select: {
          totalPoints: true,
          currentStreak: true,
          longestStreak: true,
        },
      },
    };
    const skip = (page - 1) * limit;

    const [users, count] = await Promise.all([
      prisma.users.findMany({
        where,
        include,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
      prisma.users.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        totalData: count,
        totalPage: Math.ceil(count / limit),
      },
    };
  };

  getUserById = async (id: string) => {
    return await prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        role: true,
        email: true,
      },
    });
  };

  updateAvatarUser = async ({ id, avatarUrl }: UpdateAvatarUserType) => {
    return await prisma.users.update({
      where: {
        id,
      },
      data: {
        avatar_url: avatarUrl,
      },
    });
  };

  updateProfileUser = async ({ id, fullName }: UpdateProfileUserType) => {
    return await prisma.users.update({
      where: {
        id,
      },
      data: {
        fullName,
      },
    });
  };

  updateRoleUser = async ({ id, role }: UpdateRoleUserType) => {
    return await prisma.users.update({
      where: {
        id,
      },
      data: {
        role,
      },
    });
  };
}
