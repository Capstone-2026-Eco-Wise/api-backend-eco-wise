import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type { PayloadUpdateTotalPointsType } from '../../types/eco-points-type.ts';
import type EcoPointsRepository from './eco-points-repository.ts';

export default class EcoPointsService {
  private ecoPointsRepository: EcoPointsRepository;
  private cache: CacheService;

  constructor(
    ecoPointsRepository: EcoPointsRepository,
    cache: CacheService,
  ) {
    this.ecoPointsRepository = ecoPointsRepository;
    this.cache = cache;
  }

  private getDiffDaysFromToday = (
    lastActiveDate: Date | null,
  ): number | null => {
    if (!lastActiveDate) return null;

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });

    const serverToday = new Date(); // UTC from Server

    // Convert to string with Jakarta timezone
    const tzTodayString = formatter.format(serverToday);
    const tzLastActiveString = formatter.format(new Date(lastActiveDate));

    // Convert back to Date object to get accurate day difference
    const tzToday = new Date(tzTodayString);
    const tzLastActive = new Date(tzLastActiveString);
    return Math.floor(
      (tzToday.getTime() - tzLastActive.getTime()) / (1000 * 60 * 60 * 24),
    );
  };

  private calculateStreak = (
    lastActiveDate: Date | null,
    currentStreak: number,
  ): number => {
    const diffDays = this.getDiffDaysFromToday(lastActiveDate);

    if (diffDays === null) return 1;

    if (diffDays === 0) return currentStreak;

    if (diffDays === 1) return currentStreak + 1;

    return 1;
  };

  private statusStreak = (
    lastActiveDate: Date | null,
    currentStreak: number,
  ) => {
    let status: 'active' | 'warning' | 'dead';
    let message: string;

    const diffDays = this.getDiffDaysFromToday(lastActiveDate);

    if (diffDays === 0) {
      status = 'active';
      message = `Streak aktif! Scan besok untuk lanjutkan ke ${currentStreak + 1} hari.`;
    } else if (diffDays === 1) {
      status = 'warning';
      message = `Scan hari ini atau streak ${currentStreak} hari akan reset!`;
    } else {
      status = 'dead';
      message = `Streak reset. Mulai streak baru dengan scan hari ini!`;
    }

    return {
      status,
      message,
      diffDays,
    };
  };

  createDefaultPointUser = async (userId: string) => {
    try {
      logger.info(
        `[EcoPointsService]: Starting create default point for user ${userId}`,
      );

      const totalPoints: number = 0;
      const currentStreak: number = 0;
      const longestStreak: number = 0;
      const lastActiveDate: Date = new Date(Date.now());

      const ecoPointsData = await this.ecoPointsRepository.createDefaultPoints({
        userId,
        totalPoints,
        currentStreak,
        longestStreak,
        lastActiveDate,
      });

      if (!ecoPointsData) {
        logger.warn(
          `[EcoPointsService]: Failed to create default point for user ${userId}`,
        );

        throw ErrorFactory.clientError('Failed to create eco points');
      }

      logger.info(
        `[EcoPointsService]: Default point created successfully for user ${userId}`,
      );

      return ecoPointsData;
    } catch (error) {
      const err = error as Error;
      logger.error(
        `[EcoPointsService]: Error creating default points for user ${userId} ${err.message}`,
      );
      throw ErrorFactory.serverError(err.message);
    }
  };

  getEcoPointsByUser = async (userId: string) => {
    try {
      logger.info(
        `[EcoPointsService]: Starting get eco points for user ${userId}`,
      );

      const cachedPoints = await this.cache.get(cacheKey.ecoPoints(userId));

      if (cachedPoints) {
        logger.info(
          `[EcoPointsService]: Get eco points from cache for user ${userId}`,
        );
        return { ...cachedPoints, fromCache: true };
      }

      const ecoPoints = await this.ecoPointsRepository.getByUserId(userId);

      if (!ecoPoints) {
        logger.warn(
          `[EcoPointsService]: No eco points found for user ${userId}`,
        );

        throw ErrorFactory.notFoundError('Eco points not found');
      }

      await this.cache.set(cacheKey.ecoPoints(userId), ecoPoints);

      logger.info(
        `[EcoPointsService]: Eco points retrieved successfully for user ${userId}`,
      );

      return { ...ecoPoints, fromCache: false };
    } catch (error) {
      const err = error as Error;
      logger.error(
        `[EcoPointsService]: Error eco points for user ${userId} ${err.message}`,
      );
      throw ErrorFactory.serverError(err.message);
    }
  };

  getStreakStatus = async (userId: string) => {
    try {
      logger.info(
        `[EcoPointsService]: Starting get streak status for user ${userId}`,
      );

      let currentEcoPointsUser = await this.cache.get(
        cacheKey.ecoPoints(userId),
      );

      if (!currentEcoPointsUser) {
        currentEcoPointsUser =
          await this.ecoPointsRepository.currentPointAndStreakUser(userId);
        if (currentEcoPointsUser) {
          await this.cache.set(
            cacheKey.ecoPoints(userId),
            currentEcoPointsUser,
          );
        }
      }

      if (!currentEcoPointsUser || !currentEcoPointsUser.lastActiveDate) {
        return {
          currentStreak: 0,
          longestStreak: currentEcoPointsUser?.longestStreak || 0,
          status: 'never',
          message: 'Mulai streak pertamamu dengan scan hari ini!',
        };
      }

      const { status, message, diffDays } = this.statusStreak(
        currentEcoPointsUser.lastActiveDate,
        currentEcoPointsUser.currentStreak,
      );

      return {
        currentStreak: currentEcoPointsUser.currentStreak,
        longestStreak: currentEcoPointsUser.longestStreak,
        lastActiveDate: currentEcoPointsUser.lastActiveDate,
        diffDays,
        status,
        message,
      };
    } catch (error) {
      const err = error as Error;
      logger.error(
        `[EcoPointsService]: Error streak status for user ${userId} ${err.message}`,
      );
      throw ErrorFactory.serverError(err.message);
    }
  };

  updatePointsUser = async ({
    userId,
    pointUpdate,
  }: PayloadUpdateTotalPointsType) => {
    try {
      logger.info(
        `[EcoPointsService]: Starting eco points update for user ${userId}`,
      );

      const currentPoints =
        await this.ecoPointsRepository.currentPointAndStreakUser(userId);

      if (!currentPoints) {
        logger.warn(`[EcoPointsService]: Eco points not found ${userId}`);

        throw ErrorFactory.notFoundError('Eco points not found');
      }

      const newPoints: number = currentPoints.totalPoints + Number(pointUpdate);

      // Calculate streak
      const currentStreak = this.calculateStreak(
        currentPoints.lastActiveDate,
        currentPoints.currentStreak,
      );

      let longestStreak: number = currentPoints.longestStreak;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      // Update database
      const totalPointsUpdate =
        await this.ecoPointsRepository.updatePointsUserAndStreak({
          userId,
          newPoints,
          currentStreak,
          longestStreak,
          lastActiveDate: new Date(),
        });

      if (!totalPointsUpdate) {
        logger.warn(
          `[EcoPointsService]: Failed to update eco points for user ${userId}`,
        );

        throw ErrorFactory.clientError('Failed to update eco points');
      }

      await this.cache.del(cacheKey.ecoPoints(userId));

      logger.info(
        `[EcoPointsService]: Eco points updated successfully for user ${userId}`,
      );

      return totalPointsUpdate;
    } catch (error) {
      const err = error as Error;
      logger.error(
        `[EcoPointsService]: Error updating eco points for user ${userId} ${err.message}`,
      );
      throw ErrorFactory.serverError(err.message);
    }
  };
}
