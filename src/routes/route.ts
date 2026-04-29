import { Router } from 'express';
import userRoute from '../modules/users/user-route.ts';
import wasteCategoriesRoute from '../modules/waste-categories/waste-categories-route.ts';
import ecoPointsRoute from '../modules/eco-points/eco-points-route.ts';

class MainRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router.use('/users', userRoute);
    this.router.use('/waste-categories', wasteCategoriesRoute);
    this.router.use('/eco-points', ecoPointsRoute);
  };
}

export default new MainRouter().router;
