import type { Prisma } from '../../../generated/prisma/client.ts';
import { prisma } from '../../infrastructure/database/prisma-client.ts';
import type {
  CreateDailyTasksType,
  IdDailyTasksType,
  QueryDailyTasksType,
  UpdateDailyTasksType,
} from './daily-tasks-type.ts';

export default class DailyTasksRepository {
  createTask = async ({
    categoryId,
    taskName,
    description,
    pointReward,
    isActive,
    activeDate,
  }: CreateDailyTasksType) => {
    return await prisma.dailyTasks.create({
      data: {
        categoryId: categoryId || null,
        taskName,
        description: description || null,
        pointReward,
        isActive,
        activeDate,
      },
    });
  };

  getAllDailyTask = async ({
    active,
    limit,
    page,
    category,
    search,
    sort,
    order,
  }: QueryDailyTasksType) => {
    const where: Prisma.dailyTasksWhereInput = {
      ...(active !== undefined && { isActive: active }),
      ...(search && {
        taskName: {
          contains: search,
          mode: 'insensitive',
        },
      }),
      ...(category !== undefined && {
        categoryId: category,
      }),
    };
    const include: Prisma.dailyTasksInclude = {
      category: {
        select: {
          id: true,
          categoryName: true,
          categoryCode: true,
          colorHex: true,
          description: true,
          handlingTips: true,
          pointsReward: true,
        },
      },
    };
    const skip = (page - 1) * limit;

    const [tasks, totalData] = await Promise.all([
      prisma.dailyTasks.findMany({
        where,
        include,
        skip,
        take: limit,
        orderBy: {
          ...(sort && {
            [sort]: order || 'asc',
          }),
        },
      }),
      prisma.dailyTasks.count({
        where,
      }),
    ]);

    return {
      data: tasks,
      pagination: {
        page,
        limit,
        totalData,
        totalPage: Math.ceil(totalData / limit),
      },
    };
  };

  getTaskById = async (
    { id }: IdDailyTasksType,
    optionInclude: Prisma.dailyTasksInclude = {
      category: {
        select: {
          id: true,
          categoryName: true,
          categoryCode: true,
          colorHex: true,
          description: true,
          handlingTips: true,
          pointsReward: true,
        },
      },
    },
  ) => {
    return await prisma.dailyTasks.findUnique({
      where: {
        id,
      },
      include: optionInclude,
    });
  };

  updateTask = async ({
    id,
    categoryId,
    taskName,
    description,
    pointReward,
    isActive,
    activeDate,
  }: UpdateDailyTasksType) => {
    return await prisma.dailyTasks.update({
      where: {
        id,
      },
      data: {
        ...(categoryId && { categoryId }),
        ...(taskName && { taskName }),
        ...(description && { description }),
        ...(pointReward && { pointReward }),
        ...(isActive !== undefined && { isActive }),
        ...(activeDate && { activeDate }),
      },
    });
  };

  deleteTask = async ({ id }: IdDailyTasksType) => {
    return await prisma.dailyTasks.delete({
      where: {
        id,
      },
    });
  };
}
