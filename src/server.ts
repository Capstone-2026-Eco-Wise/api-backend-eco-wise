import app from './app.ts';
import { env } from './utils/env.ts';
import { logger } from './infrastructure/logger/logger.ts';

app.listen(env.PORT, () => {
  logger.info(`Server is running on http://${env.HOST}:${env.PORT}`);
});
