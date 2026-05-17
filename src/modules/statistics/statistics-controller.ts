import type { Request, Response } from 'express';
import type StatisticsService from './statistics-service.ts';
import ResponseServer from '../../utils/response-server.ts';

export default class StatisticsController {
  private statisticsService: StatisticsService;

  constructor(statisticsService: StatisticsService) {
    this.statisticsService = statisticsService;
  }

  getDashboardStats = async (req: Request, res: Response) => {
    const result = await this.statisticsService.getDashboardStats();

    return ResponseServer.success(
      res,
      200,
      'Dashboard statistics retrieved successfully',
      result?.stats,
      result?.fromCache,
    );
  };
}
