import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.ts';
import { ErrorFactory } from '../errors/error-factory.ts';
import ResponseServer from '../utils/response-server.ts';

export const endpointNotFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(ErrorFactory.notFoundError(`Endpoint ${req.path} not found`));
};

export const errorMiddleware = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (statusCode === 500) {
    console.error(`[Error]: ${err.stack || err.message}`);
  }

  return ResponseServer.error(res, statusCode, message, null);
};
