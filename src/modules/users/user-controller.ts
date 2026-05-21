import type { Request, Response } from 'express';
import type { ROLE_USER } from '../../../generated/prisma/enums.ts';
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

  getAll = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Please login first');
    }

    const users = await this.userService.getAllUsers({
      id: req.user?.id as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      role: req.query.role as ROLE_USER,
      search: req.query.search as string,
    });

    return ResponseServer.success(
      res,
      200,
      'Get all users successfully',
      users,
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

  updateProfile = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 403, '');
    }

    const updateUser = await this.userService.updateProfile({
      id: req.user?.id as string,
      fullName: req.body.fullName,
    });

    return ResponseServer.success(
      res,
      200,
      'Update profile user successfuly',
      updateUser,
    );
  };

  updateRole = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Please login first');
    }

    const updateUser = await this.userService.updateRoleUser({
      id: req.params.id as string,
      role: req.body.role as ROLE_USER,
    });

    return ResponseServer.success(
      res,
      200,
      'Update role user successfuly',
      updateUser,
    );
  };

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Session not found');
    }

    const userDeleted = await this.userService.deletedUser(
      req.params.id as string,
    );

    return ResponseServer.success(
      res,
      200,
      'Delete user successfuly',
      userDeleted,
    );
  };
}
