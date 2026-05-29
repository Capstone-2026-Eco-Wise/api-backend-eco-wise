import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type { TransactionClient } from '../../types/transaction-type.ts';
import type EcoPointsRepository from './eco-points-repository.ts';
import type {
  FilterLeaderboardType,
  PayloadUpdateTotalPointsType,
} from './eco-points-type.ts';

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

    if (!diffDays) return currentStreak;

    return diffDays >= 1 ? currentStreak + 1 : currentStreak;
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

  private getJakartaDate = (): Date => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const jakartaDateString = formatter.format(new Date());

    return new Date(`${jakartaDateString}T00:00:00.000Z`);
  };

  createDefaultPointUser = async (userId: string) => {
    try {
      logger.info(
        `${this.serviceName}: Starting create default point for user ${userId}`,
      );

      const dateYesterday = this.getJakartaDate();
      dateYesterday.setDate(dateYesterday.getDate() - 1);

      const totalPoints: number = 0;
      const currentStreak: number = 0;
      const longestStreak: number = 0;
      const lastActiveDate: Date = dateYesterday;

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
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
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

      // status streak and diffDays from lastActiveDate
      const { status, message, diffDays } = this.statusStreak(
        ecoPointsUser?.lastActiveDate || this.getJakartaDate(),
        ecoPointsUser?.currentStreak || 0,
      );

      const responseEcoPoints = {
        diffDays,
        status,
        message,
        currentStreak: ecoPointsUser?.currentStreak,
        longestStreak: ecoPointsUser?.longestStreak,
        totalPoints: ecoPointsUser?.totalPoints,
        lastActiveDate: ecoPointsUser?.lastActiveDate,
      };

      await this.cache.set(cacheKey.ecoPoints(userId), responseEcoPoints);

      logger.info(
        `${this.serviceName}: Streak status retrieved successfully for user ${userId}`,
      );

      return { ecoPoints: responseEcoPoints, fromCache: false };
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  leaderboardUserPoints = async ({ type }: FilterLeaderboardType) => {
    try {
      logger.info(
        `${this.serviceName}: Starting leaderboard user points for type ${type}`,
      );

      if (type) {
        const leaderboardCached = await this.cache.get(
          cacheKey.leaderboard({ type }),
        );

        if (leaderboardCached) {
          return { leaderboard: leaderboardCached, fromCache: true };
        }
      }

      const leaderboard =
        await this.ecoPointsRepository.getPointUserLeaderboard({
          type,
        });

      if (leaderboard.length === 0) {
        throw ErrorFactory.notFoundError('No users found for leaderboard');
      }

      if (type) {
        await this.cache.set(cacheKey.leaderboard({ type }), leaderboard);
      }

      logger.info(
        `${this.serviceName}: Leaderboard user points retrieved successfully for type ${type}`,
      );

      return { leaderboard, fromCache: false };
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  updatePointsUserWithTx = async (
    { userId, pointUpdate }: PayloadUpdateTotalPointsType,
    tx?: TransactionClient,
  ) => {
    try {
      logger.info(
        `${this.serviceName}: Starting eco points update for user ${userId}`,
      );

      const currentEcoPointUser =
        await this.ecoPointsRepository.currentPointAndStreakUser(userId, tx);

      if (!currentEcoPointUser) {
        throw ErrorFactory.notFoundError('Eco points not found');
      }

      // calculate new point
      const newPoints = currentEcoPointUser.totalPoints + Number(pointUpdate);

      // calculate streak
      let newCurrentStreak = currentEcoPointUser.currentStreak;
      let newLongestStreak = currentEcoPointUser.longestStreak;
      let newLastActiveDate = currentEcoPointUser.lastActiveDate;

      const today = new Date();

      const isMatchDToday =
        today.toDateString() ===
        currentEcoPointUser?.lastActiveDate.toDateString();

      if (!isMatchDToday) {
        newCurrentStreak = this.calculateStreak(
          currentEcoPointUser.lastActiveDate,
          currentEcoPointUser.currentStreak,
        );

        if (newCurrentStreak > newLongestStreak) {
          newLongestStreak = newCurrentStreak;
        }

        newLastActiveDate = this.getJakartaDate();
      }

      const totalPointsUpdate =
        await this.ecoPointsRepository.updatePointsUserAndStreak(
          {
            userId,
            newPoints,
            currentStreak: newCurrentStreak,
            longestStreak: newLongestStreak,
            lastActiveDate: newLastActiveDate,
          },
          tx,
        );

      await Promise.allSettled([
        this.cache.del(cacheKey.ecoPoints(userId)),
        this.cache.del(cacheKey.leaderboard({ type: 'point' })),
        this.cache.del(cacheKey.leaderboard({ type: 'streak' })),
      ]);

      logger.info(
        `${this.serviceName}: Eco points updated successfully for user ${userId}`,
      );

      return totalPointsUpdate;
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };
}
