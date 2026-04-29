import { Router } from 'express';
import CacheService from '../../infrastructure/cache/cache-service.ts';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import EcoPointsController from './eco-points-controller.ts';
import EcoPointsRepository from './eco-points-repository.ts';
import EcoPointsService from './eco-points-service.ts';

class EcoPontsRoute {
  private ecoPointsRoute: Router;
  private ecoPointsController: EcoPointsController;
  private ecoPointsService: EcoPointsService;

  constructor() {
    this.ecoPointsRoute = Router();
    this.ecoPointsService = new EcoPointsService(
      new EcoPointsRepository(),
      new CacheService(),
    );
    this.ecoPointsController = new EcoPointsController(this.ecoPointsService);
    this.routes();
  }

  routes = () => {
    this.ecoPointsRoute.get(
      '/streak',
      authMiddleware,
      this.ecoPointsController.getStreak,
    );

    //! [test]
    this.ecoPointsRoute.post(
      '/point',
      authMiddleware,
      this.ecoPointsController.updatePoint,
    );

    return this.ecoPointsRoute;
  };
}

export default new EcoPontsRoute().routes();
