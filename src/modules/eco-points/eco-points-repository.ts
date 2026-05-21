import type { Prisma } from '../../../generated/prisma/client.ts';
import { prisma } from '../../infrastructure/database/prisma-client.ts';
import type { TransactionClient } from '../../types/transaction-type.ts';
import type {
  CreateEcoPointsTypes,
  UpdateTotalPointsType,
} from './eco-points-type.ts';

export default class EcoPointsRepository {
  createDefaultPoints = async ({
    userId,
    currentStreak,
    longestStreak,
    lastActiveDate,
    totalPoints,
  }: CreateEcoPointsTypes) => {
    return await prisma.ecoPoints.create({
      data: {
        userId,
        totalPoints,
        currentStreak,
        longestStreak,
        lastActiveDate,
      },
    });
  };

  getByUserId = async (userId: string) => {
    return await prisma.ecoPoints.findUnique({
      where: { userId },
    });
  };

  currentPointAndStreakUser = async (
    userId: string,
    tx?: TransactionClient,
  ) => {
    const db = tx ?? prisma;
    return await db.ecoPoints.findUnique({
      where: { userId },
      select: {
        totalPoints: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
      },
    });
  };

  updatePointsUserAndStreak = async (
    {
      userId,
      newPoints,
      currentStreak,
      longestStreak,
      lastActiveDate,
    }: UpdateTotalPointsType,
    tx?: TransactionClient,
  ) => {
    const db = tx ?? prisma;
    return await db.ecoPoints.update({
      where: {
        userId,
      },
      data: {
        totalPoints: newPoints,
        currentStreak,
        longestStreak,
        lastActiveDate,
      },
    });
  };

  getPointUserLeaderboard = async ({
    type = 'totalPoints',
  }: {
    type: 'currentStreak' | 'totalPoints';
  }) => {
    const orderBy: Prisma.ecoPointsOrderByWithAggregationInput = {
      ...(type === 'currentStreak' ? { currentStreak: 'desc' } : {}),
      ...(type === 'totalPoints' ? { totalPoints: 'desc' } : {}),
    };

    return await prisma.ecoPoints.findMany({
      orderBy,
    });
  };
}
