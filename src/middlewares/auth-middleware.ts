import type { NextFunction, Request, Response } from 'express';
import { supabase } from '../infrastructure/database/supabase.ts';
import { logger } from '../infrastructure/logger/logger.ts';
import ResponseServer from '../utils/response-server.ts';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('[Auth Middleware]: Unauthorized attempt without token');
      return ResponseServer.error(res, 401, 'Unauthorized. Please log in.');
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      logger.warn(`[Auth Middleware]: Invalid or expired token`);
      return ResponseServer.error(res, 401, 'Unauthenticated, please login');
    }

    req.user = data.user;

    next();
  } catch (error) {
    const err = error as Error;
    logger.error(`[Auth Middleware Error]: ${err.message}`);
    return ResponseServer.error(res, 500, err.message);
  }
};
