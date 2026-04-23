import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import { authLimiter } from '../../middlewares/rate-limit-middleware.ts';
import { validateSchema } from '../../middlewares/validation-middleware.ts';
import UserController from './user-controller.ts';
import {
  userSignInValidation,
  userSignUpValidation,
} from './user-validation.ts';

class UserRoute {
  private userRoute = Router();
  private userController = new UserController();

  constructor() {
    this.routes();
  }

  routes() {
    this.userRoute.post(
      '/sign-up',
      authLimiter,
      validateSchema(userSignUpValidation),
      this.userController.signUp,
    );
    this.userRoute.post(
      '/sign-in',
      authLimiter,
      validateSchema(userSignInValidation),
      this.userController.signIn,
    );
    this.userRoute.get('/me', authMiddleware, this.userController.session);
    this.userRoute.post('/sign-out', this.userController.logOut);

    return this.userRoute;
  }
}

export default new UserRoute().routes();
