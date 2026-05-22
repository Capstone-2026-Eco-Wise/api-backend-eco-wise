import type { Request, Response } from 'express';
import type UserTaskCompletionsService from './user-task-completions-service.ts';
import ResponseServer from '../../utils/response-server.ts';

export default class UserTaskCompletionsController {
  private UserTaskCompletionsService: UserTaskCompletionsService;

  constructor(UserTaskCompletionsService: UserTaskCompletionsService) {
    this.UserTaskCompletionsService = UserTaskCompletionsService;
  }

  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 404, 'User not found', null);
    }

    if (!req.file) {
      return ResponseServer.error(res, 404, 'File not found', null);
    }

    const userTaskCompletions =
      await this.UserTaskCompletionsService.userCompletedTask(
        req.user,
        req.file,
        req.params.taskId as string,
      );

    return ResponseServer.success(
      res,
      201,
      'Task completed successfully',
      userTaskCompletions,
    );
  };
}
