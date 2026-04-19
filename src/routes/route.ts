import { Router, type Response } from 'express';

class MainRouter {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', (_, res: Response) => {
      res.send('Eco-Wise API is running!');
    });
  }
}

export default new MainRouter().router;
