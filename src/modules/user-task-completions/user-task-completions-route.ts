import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import UploadMiddleware from '../../middlewares/upload-middleware.ts';
import { container } from '../../utils/container.ts';
import UserTaskCompletionsController from './user-task-completions-controller.ts';
import { accessControlMiddleware } from '../../middlewares/access-control-middleware.ts';

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
      this.uploadMiddleware.uploadSingle('image'),
      this.userTaskCompletionsController.create,
    );

    return this.userTaskCompletionsRoute;
  };
}

export default new UserTaskCompletionsRoute().routes();
