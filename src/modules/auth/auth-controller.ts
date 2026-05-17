import type { Request, Response } from 'express';
import ResponseServer from '../../utils/response-server.ts';
import type AuthService from './auth-service.ts';

export default class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  signUp = async (req: Request, res: Response) => {
    const { ecoPoints, session } = await this.authService.authSignUp(req.body);

    return ResponseServer.success(res, 201, 'User successfully signed up', {
      session,
      ecoPoints,
    });
  };

  signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { session } = await this.authService.authSignIn({
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

  logOut = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Session not found');
    }

    const { message } = await this.authService.authSignOut(req.user);

    return ResponseServer.success(res, 200, message, null);
  };

  updatePassword = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Session not found');
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    const { session } = await this.authService.updatePassword({
      userId: req.user.id,
      email: req.user.email,
      oldPassword,
      newPassword,
      confirmPassword,
    });

    return ResponseServer.success(
      res,
      200,
      'Password updated successfully',
      session,
    );
  };
}
