import type { Request, Response } from 'express';
import type EcoPointsService from './eco-points-service.ts';
import ResponseServer from '../../utils/response-server.ts';

export default class EcoPointsController {
  private ecoPointsService: EcoPointsService;

  constructor(ecoPointsService: EcoPointsService) {
    this.ecoPointsService = ecoPointsService;
  }

  updatePoint = async (req: Request, res: Response) => {
    const { pointUpdate } = req.body;

    const result = await this.ecoPointsService.updatePointsUser({
      userId: req.user?.id as string,
      pointUpdate,
    });

    return ResponseServer.success(
      res,
      201,
      'Successfuly get eco points by user',
      result,
    );
  };

  getStreak = async (req: Request, res: Response) => {
    const streakStatus = await this.ecoPointsService.getStreakStatus(
      req.user?.id as string,
    );
    return ResponseServer.success(
      res,
      200,
      'Successfuly get eco points by user',
      streakStatus,
    );
  };
}
