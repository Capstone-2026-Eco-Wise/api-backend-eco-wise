import { Router } from 'express';
import userRoute from '../modules/users/user-route.ts';

class MainRouter {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use('/users', userRoute);
  }
}

export default new MainRouter().router;
