import { logger } from '../infrastructure/logger/logger.ts';
import { AppError } from './app-error.ts';

export class ErrorFactory {
  private static build(message: string, statusCode: number, name: string) {
    return new AppError(message, statusCode, name);
  }

  static handlerServiceError = (err: unknown, serviceName: string): never => {
    const error = err as Error;

    if ((error as AppError).statusCode) {
      logger.error(`${serviceName}: ${error.message}`);
      throw error;
    }
    logger.error(`${serviceName}: ${error.message}`);
    throw this.serverError(error.message);
  };

  static clientError = (
    message: string,
    statusCode = 400,
    name = 'Client Error',
  ) => {
    try {
      const parsed = JSON.parse(message);

      if (Array.isArray(parsed)) {
        const cleanMessage = parsed
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        return this.build(cleanMessage, statusCode, 'Validation Error');
      }
    } catch {
      return this.build(message, statusCode, name);
    }
  };

  static notFoundError = (message: string, name = 'Resource Not Found') => {
    return this.build(message, 404, name);
  };

  static authenticationError = (
    message: string,
    name = 'Authentication Error',
  ) => {
    return this.build(message, 401, name);
  };

  static authorizationError = (
    message: string,
    statusCode = 403,
    name = 'Authorization Error',
  ) => {
    return this.build(message, statusCode, name);
  };

  static serverError = (
    message: string,
    statusCode = 500,
    name = 'Server Error',
  ) => {
    return this.build(message, statusCode, name);
  };
}
