import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import { authLimiter } from '../../middlewares/rate-limit-middleware.ts';
import { validateSchema } from '../../middlewares/validation-middleware.ts';
import { container } from '../../utils/container.ts';
import UserController from './user-controller.ts';
import {
  userSignInValidation,
  userSignUpValidation,
} from './user-validation.ts';
import UploadMiddleware from '../../middlewares/upload-middleware.ts';

class UserRoute {
  private userRoute: Router;
  private userController: UserController;
  private uploadMiddleware: UploadMiddleware;

  constructor() {
    this.userRoute = Router();
    this.userController = new UserController(container.userService);
    this.uploadMiddleware = new UploadMiddleware();
    this.routes();
  }

  routes = () => {
    this.userRoute.post(
      '/sign-up',
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
    this.userRoute.patch(
      '/avatar',
      authMiddleware,
      this.uploadMiddleware.uploadSingle('avatar'),
      this.userController.updateAvatar,
    );
    this.userRoute.delete(
      '/sign-out',
      authMiddleware,
      this.userController.logOut,
    );

    return this.userRoute;
  };
}

export default new UserRoute().routes();
