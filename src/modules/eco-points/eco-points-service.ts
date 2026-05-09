import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type { PayloadUpdateTotalPointsType } from './eco-points-type.ts';
import type EcoPointsRepository from './eco-points-repository.ts';

export default class EcoPointsService {
  private ecoPointsRepository: EcoPointsRepository;
  private cache: CacheService;
  private serviceName: string;

  constructor(ecoPointsRepository: EcoPointsRepository, cache: CacheService) {
    this.ecoPointsRepository = ecoPointsRepository;
    this.cache = cache;
    this.serviceName = '[Eco Points Service]';
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
        `${this.serviceName}: Starting create default point for user ${userId}`,
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
        throw ErrorFactory.clientError('Failed to create eco points');
      }

      logger.info(
        `${this.serviceName}: Default point created successfully for user ${userId}`,
      );

      return ecoPointsData;
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  getStreakStatus = async (userId: string) => {
    try {
      logger.info(
        `${this.serviceName}: Starting get streak status for user ${userId}`,
      );

      const ecoPointsUserCached = await this.cache.get(
        cacheKey.ecoPoints(userId),
      );

      if (ecoPointsUserCached) {
        return { ecoPoints: ecoPointsUserCached, fromCache: true };
      }

      const ecoPointsUser = await this.ecoPointsRepository.getByUserId(userId);

      // when user first time -> lastActiveDate is NULL
      if (!ecoPointsUser || !ecoPointsUser.lastActiveDate) {
        await this.createDefaultPointUser(userId);

        return {
          totalPoints: ecoPointsUser?.totalPoints || 0,
          currentStreak: 0,
          longestStreak: ecoPointsUser?.longestStreak || 0,
          status: 'never',
          message: 'Mulai streak pertamamu dengan scan hari ini!',
        };
      }

      // status streak and diffDays from lastActiveDate
      const { status, message, diffDays } = this.statusStreak(
        ecoPointsUser.lastActiveDate,
        ecoPointsUser.currentStreak,
      );

      const resposePoints = {
        diffDays,
        status,
        message,
        currentStreak: ecoPointsUser.currentStreak,
        longestStreak: ecoPointsUser.longestStreak,
        totalPoints: ecoPointsUser.totalPoints,
        lastActiveDate: ecoPointsUser.lastActiveDate,
      };

      await this.cache.set(cacheKey.ecoPoints(userId), resposePoints);

      logger.info(
        `${this.serviceName}: Streak status retrieved successfully for user ${userId}`,
      );

      return { ecoPoints: resposePoints, fromCache: false };
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  updatePointsUser = async ({
    userId,
    pointUpdate,
  }: PayloadUpdateTotalPointsType) => {
    try {
      logger.info(
        `${this.serviceName}: Starting eco points update for user ${userId}`,
      );

      const currentPoints =
        await this.ecoPointsRepository.currentPointAndStreakUser(userId);

      if (!currentPoints) {
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
        throw ErrorFactory.clientError('Failed to update eco points');
      }

      await this.cache.del(cacheKey.ecoPoints(userId));

      logger.info(
        `${this.serviceName}: Eco points updated successfully for user ${userId}`,
      );

      return totalPointsUpdate;
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };
}
