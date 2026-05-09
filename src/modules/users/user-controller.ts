import type { Request, Response } from 'express';
import ResponseServer from '../../utils/response-server.ts';
import type UserService from './user-service.ts';

export default class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  session = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Session not found');
    }

    const { user, fromCache } = await this.userService.sessionUser(req.user);

    return ResponseServer.success(
      res,
      200,
      `User successfully retrieved${fromCache ? ' from cache' : ''}`,
      user,
      fromCache,
    );
  };

  updateAvatar = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Please login first');
    }

    if (!req.file) {
      return ResponseServer.error(res, 400, 'Image is required');
    }

    const user = await this.userService.updateAvatarUser({
      user: req.user,
      file: req.file,
    });

    return ResponseServer.success(
      res,
      200,
      'Successfuly update avatar user',
      user,
    );
  };
}
