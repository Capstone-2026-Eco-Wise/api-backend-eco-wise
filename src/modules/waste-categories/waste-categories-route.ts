import { Router } from 'express';
import { accessControlMiddleware } from '../../middlewares/access-control-middleware.ts';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import {
  validateParams,
  validateSchema,
} from '../../middlewares/validation-middleware.ts';
import { container } from '../../utils/container.ts';
import WasteCategoriesController from './waste-categories-controller.ts';
import {
  createWasteCategorySchema,
  updateWasteCategorySchema,
} from './waste-categories-validation.ts';

class WasteCategoriesRoute {
  private wasteCategoriesRoute: Router;
  private wasteCategoriesController: WasteCategoriesController;

  constructor() {
    this.wasteCategoriesRoute = Router();
    this.wasteCategoriesController = new WasteCategoriesController(
      container.wasteCategoriesService,
    );
    this.routes();
  }

  routes = () => {
    this.wasteCategoriesRoute.post(
      '/create',
      authMiddleware,
      accessControlMiddleware(['admin']),
      validateSchema(createWasteCategorySchema),
      this.wasteCategoriesController.create,
    );
    this.wasteCategoriesRoute.get('/', this.wasteCategoriesController.getAll);
    this.wasteCategoriesRoute.get(
      '/:id',
      validateParams('id'),
      this.wasteCategoriesController.getById,
    );
    this.wasteCategoriesRoute.patch(
      '/update/:id',
      authMiddleware,
      accessControlMiddleware(['admin']),
      validateSchema(updateWasteCategorySchema),
      validateParams('id'),
      this.wasteCategoriesController.update,
    );
    this.wasteCategoriesRoute.delete(
      '/delete/:id',
      authMiddleware,
      accessControlMiddleware(['admin']),
      validateParams('id'),
      this.wasteCategoriesController.delete,
    );

    return this.wasteCategoriesRoute;
  };
}

export default new WasteCategoriesRoute().routes();
