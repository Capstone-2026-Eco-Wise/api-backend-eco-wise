/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.ts';
import { ErrorFactory } from '../errors/error-factory.ts';
import { logger } from '../infrastructure/logger/logger.ts';
import ResponseServer from '../utils/response-server.ts';

export const endpointNotFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(
    ErrorFactory.notFoundError(`Endpoint ${req.method} ${req.path} not found`),
  );
};

export const errorMiddleware = (
  err: Error | AppError | any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err?.code && typeof err.code === 'string' && err.code.startsWith('P')) {
    if (err.code === 'P2002') {
      statusCode = 409;

      const target = (err.meta?.target as string[]) || ['resource'];

      message = `Conflict: ${target.join(', ')} already exists`;

      logger.warn(`[Client Error]: ${message}`);
    } else if (err.code === 'P2025') {
      statusCode = 404;

      message = 'Resource not found';

      logger.warn(`[Client Error]: ${message}`);
    } else {
      logger.error(`[Prisma Error]: \n${err.message}`);
    }

    return ResponseServer.error(res, statusCode, message, null);
  }

  if (err instanceof AppError) {
    statusCode = err.statusCode;

    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (statusCode >= 500) {
    logger.error(`[Server Error]: ${err.message}`);
  } else {
    logger.error(`[Client Error]: ${message}`);
  }

  return ResponseServer.error(res, statusCode, message, null);
};
