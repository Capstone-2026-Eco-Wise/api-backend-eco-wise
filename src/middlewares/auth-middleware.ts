import type { NextFunction, Request, Response } from 'express';
import { ErrorFactory } from '../errors/error-factory.ts';
import { cacheKey } from '../infrastructure/cache/cache-key.ts';
import { prisma } from '../infrastructure/database/prisma-client.ts';
import { supabase } from '../infrastructure/database/supabase.ts';
import { logger } from '../infrastructure/logger/logger.ts';
import { container } from '../utils/container.ts';
import ResponseServer from '../utils/response-server.ts';

const USER_SESSION_CACHE_TTL = 60 * 15;

const middlewareName = '[Auth Middleware]';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`${middlewareName}: Unauthorized attempt without token`);
      return ResponseServer.error(res, 401, 'Unauthorized. Please log in.');
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      logger.warn(`${middlewareName}: Invalid or expired token`);
      return ResponseServer.error(res, 401, 'Unauthenticated, please login');
    }

    const userId = data.user.id;

    let dbUser = await container.cacheService.get(cacheKey.userSession(userId));

    if (!dbUser) {
      dbUser = await prisma.users.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullName: true,
          username: true,
          email: true,
          role: true,
          avatar_url: true,
          aiTokens: true,
        },
      });

      if (!dbUser) {
        logger.warn(`${middlewareName}: User not found in database`);
        return ResponseServer.error(res, 404, 'User not found in database');
      }

      await container.cacheService.set(
        cacheKey.userSession(userId),
        dbUser,
        USER_SESSION_CACHE_TTL,
      );
    }

    req.user = dbUser;
    req.supabase = data.user;

    next();
  } catch (error) {
    throw ErrorFactory.handlerServiceError(error, middlewareName);
  }
};
