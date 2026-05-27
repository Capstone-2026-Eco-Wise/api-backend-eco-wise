import type { NextFunction, Request, Response } from 'express';
import type { ROLE_USER } from '../../generated/prisma/enums.ts';
import { logger } from '../infrastructure/logger/logger.ts';
import ResponseServer from '../utils/response-server.ts';

export const accessControlMiddleware = (roles: ROLE_USER | ROLE_USER[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      logger.error('[Access Control Middleware Error]: User not found');
      return ResponseServer.error(res, 404, 'User not found');
    }

    if (!allowedRoles.includes(user.role as ROLE_USER)) {
      logger.error('[Access Control Middleware Error]: Forbidden');
      return ResponseServer.error(res, 403, 'Forbidden');
    }

    next();
  };
};
