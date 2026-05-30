import { Router } from 'express';
import { accessControlMiddleware } from '../../middlewares/access-control-middleware.ts';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import UploadMiddleware from '../../middlewares/upload-middleware.ts';
import { validateParams } from '../../middlewares/validation-middleware.ts';
import { container } from '../../utils/container.ts';
import UserTaskCompletionsController from './user-task-completions-controller.ts';

class UserTaskCompletionsRoute {
  private userTaskCompletionsController: UserTaskCompletionsController;
  private uploadMiddleware: UploadMiddleware;
  private userTaskCompletionsRoute: Router;

  constructor() {
    this.userTaskCompletionsController = new UserTaskCompletionsController(
      container.userTaskCompletionsService,
    );
    this.uploadMiddleware = new UploadMiddleware();
    this.userTaskCompletionsRoute = Router();
  }

  routes = () => {
    this.userTaskCompletionsRoute.post(
      '/:taskId',
      authMiddleware,
      accessControlMiddleware('user'),
      validateParams('taskId'),
      this.uploadMiddleware.uploadSingle('image'),
      this.userTaskCompletionsController.create,
    );

    this.userTaskCompletionsRoute.get(
      '/',
      authMiddleware,
      accessControlMiddleware('user'),
      this.userTaskCompletionsController.getAll,
    );

    return this.userTaskCompletionsRoute;
  };
}

export default new UserTaskCompletionsRoute().routes();
