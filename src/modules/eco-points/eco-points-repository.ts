import { prisma } from '../../infrastructure/database/prisma-client.ts';
import type {
  CreateEcoPointsTypes,
  UpdateTotalPointsType,
} from '../../types/eco-points-type.ts';

export default class EcoPointsRepository {
  createDefaultPoints = async ({
    userId,
    totalPoints,
    currentStreak,
    longestStreak,
    lastActiveDate,
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

  currentPointAndStreakUser = async (userId: string) => {
    return await prisma.ecoPoints.findUnique({
      where: { userId },
      select: {
        totalPoints: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
      },
    });
  };

  updatePointsUserAndStreak = async ({
    userId,
    newPoints,
    currentStreak,
    longestStreak,
    lastActiveDate,
  }: UpdateTotalPointsType) => {
    return await prisma.ecoPoints.update({
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
}
