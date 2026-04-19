import { AppError } from './app-error.ts';

export class ErrorFactory {
  private static build(message: string, statusCode: number, name: string) {
    return new AppError(message, statusCode, name);
  }

  public static clientError(
    message: string,
    statusCode = 400,
    name = 'Client Error',
  ) {
    return this.build(message, statusCode, name);
  }

  public static notFoundError(message: string, name = 'Resource Not Found') {
    return this.build(message, 404, name);
  }

  public static authenticationError(
    message: string,
    statusCode = 401,
    name = 'Authentication Error',
  ) {
    return this.build(message, statusCode, name);
  }

  public static authorizationError(
    message: string,
    statusCode = 403,
    name = 'Authorization Error',
  ) {
    return this.build(message, statusCode, name);
  }

  public static serverError(
    message: string,
    statusCode = 500,
    name = 'Server Error',
  ) {
    return this.build(message, statusCode, name);
  }
}
