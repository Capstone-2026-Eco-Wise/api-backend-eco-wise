import { Router } from 'express';
import { container } from '../../utils/container.ts';
import StatisticsController from './statistics-controller.ts';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import { accessControlMiddleware } from '../../middlewares/access-control-middleware.ts';

class StatisticsRoute {
  private statisticsRoute: Router;
  private statisticsController: StatisticsController;

  constructor() {
    this.statisticsRoute = Router();
    this.statisticsController = new StatisticsController(
      container.statisticsService,
    );
    this.routes();
  }

  routes = () => {
    this.statisticsRoute.get(
      '/',
      authMiddleware,
      accessControlMiddleware(['admin']),
      this.statisticsController.getDashboardStats,
    );
    return this.statisticsRoute;
  };
}

export default new StatisticsRoute().routes();
