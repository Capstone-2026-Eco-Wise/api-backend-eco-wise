import { Router, type Response } from 'express';
import { env } from '../utils/env.ts';

class HealthRouter {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private formatUptime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hrs} hours ${mins} minutes ${secs} seconds`;
  }

  private initializeRoutes(): void {
    this.router.get('/', (_, res: Response) => {
      res.status(200).json({
        status: 'OK',
        message: 'Eco-Wise API is running!',
        uptime: this.formatUptime(process.uptime()),
        memoryUsage: process.memoryUsage(),
        environment: env.NODE_ENV,
        timeStamp: new Date().toISOString(),
      });
    });
  }
}

export default new HealthRouter().router;
