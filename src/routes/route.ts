import { Router, type Response } from 'express';
import ecoPointsRoute from '../modules/eco-points/eco-points-route.ts';
import scanHistoryRoute from '../modules/scan-history/scan-history-route.ts';
import userRoute from '../modules/users/user-route.ts';
import wasteCategoriesRoute from '../modules/waste-categories/waste-categories-route.ts';
import { env } from '../utils/env.ts';
import { formatUptime } from '../utils/formated-time.ts';

class MainRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
    this.healthRoute();
  }

  private initializeRoutes = (): void => {
    this.router.use('/users', userRoute);
    this.router.use('/waste-categories', wasteCategoriesRoute);
    this.router.use('/eco-points', ecoPointsRoute);
    this.router.use('/scan-history', scanHistoryRoute);
  };

  private healthRoute = (): void => {
    this.router.get('/', (_, res: Response) => {
      res.status(200).json({
        status: 'OK',
        message: 'Eco-Wise API is running!',
        uptime: formatUptime(process.uptime()),
        memoryUsage: process.memoryUsage(),
        environment: env.NODE_ENV,
        timeStamp: new Date().toISOString(),
      });
    });
  };
}

export default new MainRouter().router;
