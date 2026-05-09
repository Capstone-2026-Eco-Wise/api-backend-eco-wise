import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import UploadMiddleware from '../../middlewares/upload-middleware.ts';
import { container } from '../../utils/container.ts';
import UserController from './user-controller.ts';

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
    this.userRoute.get('/me', authMiddleware, this.userController.session);
    this.userRoute.patch(
      '/me/avatar',
      authMiddleware,
      this.uploadMiddleware.uploadSingle('avatar'),
      this.userController.updateAvatar,
    );

    return this.userRoute;
  };
}

export default new UserRoute().routes();
