import { Router } from 'express';
import { accessControlMiddleware } from '../../middlewares/access-control-middleware.ts';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import {
  validateQuery,
  validateSchema,
} from '../../middlewares/validation-middleware.ts';
import { container } from '../../utils/container.ts';
import DailyTasksController from './daily-tasks-controller.ts';
import {
  createDailyTasksValidation,
  queryDailyTasksValidation,
  updateDailyTasksValidation,
} from './daily-tasks-validation.ts';

class DailyTasksRoute {
  private dailyTasksRoute: Router;
  private dailyTasksController: DailyTasksController;

  constructor() {
    this.dailyTasksController = new DailyTasksController(
      container.dailyTasksService,
    );
    this.dailyTasksRoute = Router();
    this.route();
  }

  route() {
    this.dailyTasksRoute.post(
      '/',
      authMiddleware,
      accessControlMiddleware(['admin']),
      validateSchema(createDailyTasksValidation),
      this.dailyTasksController.create,
    );
    this.dailyTasksRoute.get(
      '/',
      authMiddleware,
      accessControlMiddleware(['admin']),
      validateQuery(queryDailyTasksValidation),
      this.dailyTasksController.getAll,
    );
    this.dailyTasksRoute.put(
      '/:id',
      authMiddleware,
      accessControlMiddleware(['admin']),
      validateSchema(updateDailyTasksValidation),
      this.dailyTasksController.update,
    );
    this.dailyTasksRoute.delete(
      '/:id',
      authMiddleware,
      accessControlMiddleware(['admin']),
      this.dailyTasksController.delete,
    );
    return this.dailyTasksRoute;
  }
}

export default new DailyTasksRoute().route();
