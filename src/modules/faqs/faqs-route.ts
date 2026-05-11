import { Router } from 'express';
import { accessControlMiddleware } from '../../middlewares/access-control-middleware.ts';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import { validateSchema } from '../../middlewares/validation-middleware.ts';
import { container } from '../../utils/container.ts';
import FaqsController from './faqs-controller.ts';
import { createFAQValidation, updateFAQValidation } from './faqs-validation.ts';

class FaqsRoute {
  private faqsRoute: Router;
  private faqsController: FaqsController;

  constructor() {
    this.faqsRoute = Router();
    this.faqsController = new FaqsController(container.faqsService);
    this.routes();
  }

  routes = () => {
    this.faqsRoute.post(
      '/',
      authMiddleware,
      accessControlMiddleware(['admin']),
      validateSchema(createFAQValidation),
      this.faqsController.create,
    );
    this.faqsRoute.get('/public', this.faqsController.getPublicFAQs);
    this.faqsRoute.get(
      '/creator',
      authMiddleware,
      accessControlMiddleware(['admin']),
      this.faqsController.getFAQsCreator,
    );
    this.faqsRoute.put(
      '/:id',
      authMiddleware,
      accessControlMiddleware(['admin']),
      validateSchema(updateFAQValidation),
      this.faqsController.updateByCreator,
    );
    this.faqsRoute.delete(
      '/:id',
      authMiddleware,
      accessControlMiddleware(['admin']),
      this.faqsController.deleteByCreator,
    );

    return this.faqsRoute;
  };
}

export default new FaqsRoute().routes();
