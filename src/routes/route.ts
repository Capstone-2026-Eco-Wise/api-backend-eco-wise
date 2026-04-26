import { Router } from 'express';
import userRoute from '../modules/users/user-route.ts';
import wasteCategoriesRoute from '../modules/waste-categories/waste-categories-route.ts';

class MainRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router.use('/users', userRoute);
    this.router.use('/waste-categories', wasteCategoriesRoute);
  };
}

export default new MainRouter().router;
