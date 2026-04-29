import type { Request, Response } from 'express';
import ResponseServer from '../../utils/response-server.ts';
import type UserService from './user-service.ts';

export default class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  signUp = async (req: Request, res: Response) => {
    const { ecoPoints, session } = await this.userService.registerUser(
      req.body,
    );

    return ResponseServer.success(res, 201, 'User successfully registered', {
      session,
      ecoPoints,
    });
  };

  signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { session } = await this.userService.loginUser({
      email,
      password,
    });

    return ResponseServer.success(
      res,
      200,
      'User successfully signed in',
      session,
    );
  };

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

  logOut = async (req: Request, res: Response) => {
    const id = req.user?.id;

    const user = await this.userService.logoutUser(id as string);

    return ResponseServer.success(res, 200, user, null);
  };
}
