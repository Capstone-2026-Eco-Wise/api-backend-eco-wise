import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import { authLimiter } from '../../middlewares/rate-limit-middleware.ts';
import { validateSchema } from '../../middlewares/validation-middleware.ts';
import { container } from '../../utils/container.ts';
import AuthController from './auth-controller.ts';
import { signInValidation, signUpValidation } from './auth-validation.ts';

class AuthRoute {
  private authRoute: Router;
  private authController: AuthController;

  constructor() {
    this.authRoute = Router();
    this.authController = new AuthController(container.authService);
    this.routes();
  }

  routes = () => {
    this.authRoute.post(
      '/sign-up',
      validateSchema(signUpValidation),
      this.authController.signUp,
    );
    this.authRoute.post(
      '/sign-in',
      authLimiter,
      validateSchema(signInValidation),
      this.authController.signIn,
    );
    this.authRoute.delete(
      '/sign-out',
      authMiddleware,
      this.authController.logOut,
    );

    return this.authRoute;
  };
}

export default new AuthRoute().routes();
