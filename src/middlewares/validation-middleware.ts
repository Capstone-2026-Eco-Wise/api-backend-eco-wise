import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ErrorFactory } from '../errors/error-factory.ts';
import { logger } from '../infrastructure/logger/logger.ts';
import { paramsValidation } from '../validations/params-validation.ts';

type RequestLocation = 'body' | 'params' | 'query';

function formateMessage(message: string) {
  const parsed = JSON.parse(message);

  if (Array.isArray(parsed)) {
    const cleanMessage = parsed
      .map(
        (err: { path: string[]; message: string }) =>
          `${err.path.join('.')}: ${err.message}`,
      )
      .join(', ');

    return cleanMessage;
  }

  return message;
}

const createValidationMiddleware = (
  schema: ZodType,
  location: RequestLocation,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[location]);

    if (!parsed.success) {
      const formattedMessage = formateMessage(parsed.error.message);

      logger.error(`[Validation Middleware]: ${formattedMessage}`);

      return next(ErrorFactory.clientError(formattedMessage));
    }

    Object.defineProperty(req, location, {
      value: parsed.data,
      writable: true,
      enumerable: true,
      configurable: true,
    });

    next();
  };
};

export const validateSchema = (schema: ZodType) =>
  createValidationMiddleware(schema, 'body');

export const validateParams = (key: string) =>
  createValidationMiddleware(paramsValidation(key), 'params');

export const validateQuery = (schema: ZodType) =>
  createValidationMiddleware(schema, 'query');
