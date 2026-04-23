import type { Request, Response } from 'express';
import ResponseServer from '../../utils/response-server.ts';
import UserService from './user-service.ts';

export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.session = this.session.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  async signUp(req: Request, res: Response) {
    const { full_name, email, password, username } = req.body;

    const { session } = await this.userService.registerUser({
      full_name,
      email,
      password,
      username,
    });

    return ResponseServer.success(
      res,
      201,
      'User successfully registered',
      session,
    );
  }

  async signIn(req: Request, res: Response) {
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
  }

  async session(req: Request, res: Response) {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Session not found');
    }

    const { user, fromCache } = await this.userService.sessionUser(req.user.id);

    return ResponseServer.success(
      res,
      200,
      `User successfully retrieved ${fromCache ? '(from cache)' : ''}`,
      user,
      fromCache,
    );
  }

  async logOut(req: Request, res: Response) {
    const user = await this.userService.logoutUser();

    return ResponseServer.success(res, 200, user, null);
  }
}
