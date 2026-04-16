import cors from 'cors';
import express, { type Application, type Response } from 'express';
import healthRouter from './routers/health-router.ts';
import router from './routers/router.ts';
import { env } from './utils/env.ts';

class App {
  public app: Application = express();

  constructor() {
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors({ origin: env.ORIGIN_ALLOWED }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    this.app.get('/', (_, res: Response) => {
      res.send('Welcome to Eco-Wise API');
    });
    this.app.use('/health', healthRouter);
    this.app.use('/api/eco-wise', router);
  }
}

export default new App().app;
