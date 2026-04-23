import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ErrorFactory } from '../errors/error-factory.ts';

export const validateSchema = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return next(
        ErrorFactory.clientError(parsed.error.message)
      );
    }

    req.body = parsed.data;

    next();
  };
};
