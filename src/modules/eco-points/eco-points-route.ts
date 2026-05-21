import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import { container } from '../../utils/container.ts';
import EcoPointsController from './eco-points-controller.ts';

class EcoPontsRoute {
  private ecoPointsRoute: Router;
  private ecoPointsController: EcoPointsController;

  constructor() {
    this.ecoPointsRoute = Router();
    this.ecoPointsController = new EcoPointsController(
      container.ecoPointsService,
    );
    this.routes();
  }

  routes = () => {
    this.ecoPointsRoute.get(
      '/streak',
      authMiddleware,
      this.ecoPointsController.getStreak,
    );
    this.ecoPointsRoute.get(
      '/leaderboard',
      this.ecoPointsController.leaderboard,
    );

    return this.ecoPointsRoute;
  };
}

export default new EcoPontsRoute().routes();
