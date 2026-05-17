import type { Request, Response } from 'express';
import ResponseServer from '../../utils/response-server.ts';
import type DailyTasksService from './daily-tasks-service.ts';
import type { QueryDailyTasksType } from './daily-tasks-type.ts';

export default class DailyTasksController {
  private dailyTasksService: DailyTasksService;

  constructor(dailyTasksService: DailyTasksService) {
    this.dailyTasksService = dailyTasksService;
  }

  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Unauthorized');
    }

    const dailyTasks = await this.dailyTasksService.createMasterTasks(req.body);

    return ResponseServer.success(
      res,
      201,
      'Successfully created master tasks',
      dailyTasks,
    );
  };

  getAll = async (req: Request, res: Response) => {
    const dailyTasks = await this.dailyTasksService.getAllDailyTasks(
      req.query as unknown as QueryDailyTasksType,
    );

    return ResponseServer.success(
      res,
      200,
      'Successfully retrieved daily tasks',
      dailyTasks,
    );
  };

  getById = async (req: Request, res: Response) => {
    const dailyTasks = await this.dailyTasksService.getDailyTaskById({
      id: req.params.id as string,
    });

    return ResponseServer.success(
      res,
      200,
      'Successfully retrieved daily tasks',
      dailyTasks,
    );
  };

  update = async (req: Request, res: Response) => {
    const dailyTasks = await this.dailyTasksService.updateDailyTasks({
      id: req.params.id,
      ...req.body,
    });

    return ResponseServer.success(
      res,
      200,
      'Successfully updated daily tasks',
      dailyTasks,
    );
  };

  delete = async (req: Request, res: Response) => {
    const dailyTasks = await this.dailyTasksService.deleteDailyTasks(
      req.params.id as string,
    );

    return ResponseServer.success(
      res,
      200,
      'Successfully deleted daily tasks',
      dailyTasks,
    );
  };
}
