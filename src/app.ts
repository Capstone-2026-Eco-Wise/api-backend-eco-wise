import cors from 'cors';
import express, { type Application, type Response } from 'express';
import helmet from 'helmet';
import {
  endpointNotFoundHandler,
  errorMiddleware,
} from './middlewares/error-middleware.ts';
import router from './routes/route.ts';
import { env } from './utils/env.ts';

class App {
  public app: Application = express();

  constructor() {
    this.initializePreRouteMiddlewares();
    this.initializeRoutes();
    this.initializePostRouteMiddlewares();
  }

  private initializePreRouteMiddlewares = (): void => {
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: env.ORIGIN_ALLOWED,
        credentials: true,
      }),
    );
    this.app.use(express.json());
  };

  private initializeRoutes = (): void => {
    this.app.get('/', (_, res: Response) => {
      res.redirect('/api');
    });
    this.app.use('/api', router);
  };

  private initializePostRouteMiddlewares = (): void => {
    this.app.use(endpointNotFoundHandler);
    this.app.use(errorMiddleware);
  };
}

export default new App().app;
