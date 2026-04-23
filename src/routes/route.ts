import { Router, type Response } from 'express';
import userRoute from './user-route.ts';

class MainRouter {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', (_, res: Response) => {
      res.send('Eco-Wise API is running!');
    });
    this.router.use('/users', userRoute);
  }
}

export default new MainRouter().router;
