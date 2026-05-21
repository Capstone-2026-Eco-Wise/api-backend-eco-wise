import type { Request, Response } from 'express';
import ResponseServer from '../../utils/response-server.ts';
import type EcoPointsService from './eco-points-service.ts';

export default class EcoPointsController {
  private ecoPointsService: EcoPointsService;

  constructor(ecoPointsService: EcoPointsService) {
    this.ecoPointsService = ecoPointsService;
  }

  getStreak = async (req: Request, res: Response) => {
    const { ecoPoints, fromCache } =
      await this.ecoPointsService.getStreakStatus(req.user?.id as string);

    return ResponseServer.success(
      res,
      200,
      'Successfuly get eco points and streak status',
      ecoPoints,
      fromCache,
    );
  };

  leaderboard = async (req: Request, res: Response) => {
    const { type } = req.query;

    const leaderboard = await this.ecoPointsService.leaderboardUserPoints({
      type: type as 'currentStreak' | 'totalPoints',
    });

    return ResponseServer.success(
      res,
      200,
      'Successfuly get leaderboard',
      leaderboard,
    );
  };
}
