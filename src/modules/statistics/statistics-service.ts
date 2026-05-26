import { logger } from '../../infrastructure/logger/logger.ts';
import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import type StatisticsRepository from './statistics-repository.ts';

export default class StatisticsService {
  private statisticsRepository: StatisticsRepository;
  private cache: CacheService;
  private serviceName = 'StatisticsService';

  constructor(statisticsRepository: StatisticsRepository, cache: CacheService) {
    this.statisticsRepository = statisticsRepository;
    this.cache = cache;
  }

  getDashboardStats = async () => {
    try {
      logger.info(`${this.serviceName}: Fetching dashboard statistics`);
      const key = cacheKey.dashboardStats();

      const cachedStats = await this.cache.get(key);

      if (cachedStats) {
        logger.info(
          `${this.serviceName}: Dashboard statistics retrieved from cache`,
        );
        return { stats: cachedStats, fromCache: true };
      }

      const stats = await this.statisticsRepository.getDashboardStatistics();

      await this.cache.set(key, stats, 600);

      logger.info(
        `${this.serviceName}: Dashboard statistics retrieved from DB`,
      );
      return { stats, fromCache: false };
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };
}
