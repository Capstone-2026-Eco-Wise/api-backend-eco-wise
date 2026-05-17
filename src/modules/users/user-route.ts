import { Router } from 'express';
import { accessControlMiddleware } from '../../middlewares/access-control-middleware.ts';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import UploadMiddleware from '../../middlewares/upload-middleware.ts';
import { validateSchema } from '../../middlewares/validation-middleware.ts';
import { container } from '../../utils/container.ts';
import UserController from './user-controller.ts';
import {
  updateProfileUserValidation,
  updateRoleUserValidation,
} from './user-validation.ts';

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
    this.userRoute.get(
      '/',
      authMiddleware,
      accessControlMiddleware(['admin']),
      this.userController.getAll,
    );
    this.userRoute.get('/me', authMiddleware, this.userController.session);
    this.userRoute.patch(
      '/me/avatar',
      authMiddleware,
      this.uploadMiddleware.uploadSingle('avatar'),
      this.userController.updateAvatar,
    );
    this.userRoute.patch(
      '/me/profile',
      authMiddleware,
      validateSchema(updateProfileUserValidation),
      this.userController.updateProfile,
    );
    this.userRoute.patch(
      '/:id/role',
      authMiddleware,
      accessControlMiddleware(['admin']),
      validateSchema(updateRoleUserValidation),
      this.userController.updateRole,
    );

    return this.userRoute;
  };
}

export default new UserRoute().routes();
