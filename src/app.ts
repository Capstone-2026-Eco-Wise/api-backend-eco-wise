import cors from 'cors';
import express, { type Application, type Response } from 'express';
import helmet from 'helmet';
import {
  endpointNotFoundHandler,
  errorMiddleware,
} from './middlewares/error-middleware.ts';
import router from './routes/route.ts';
import { env } from './utils/env.ts';
import { formatUptime } from './utils/formated-time.ts';

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
    this.healthRoute();
    this.app.use('/api', router);
  };

  private initializePostRouteMiddlewares = (): void => {
    this.app.use(endpointNotFoundHandler);
    this.app.use(errorMiddleware);
  };

  private healthRoute = (): void => {
    this.app.get('/', (_, res: Response) => {
      res.status(200).json({
        status: 'OK',
        message: 'Eco-Wise API is running!',
        uptime: formatUptime(process.uptime()),
        memoryUsage: process.memoryUsage(),
        environment: env.NODE_ENV,
        timeStamp: new Date().toISOString(),
      });
    });
  }
}

export default new App().app;
