import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { cacheKey } from '../infrastructure/cache/cache-key.ts';
import { prisma } from '../infrastructure/database/prisma-client.ts';
import { logger } from '../infrastructure/logger/logger.ts';
import { container } from '../utils/container.ts';
import { env } from '../utils/env.ts';
import ResponseServer from '../utils/response-server.ts';

const helperMiddleware = {
  USER_SESSION_CACHE_TTL: 60 * 15,
  middlewareName: '[Auth Middleware]',
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(
        `${helperMiddleware.middlewareName}: Unauthorized attempt without token`,
      );

      return ResponseServer.error(res, 401, 'Unauthorized. Please log in.');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      logger.warn(
        `${helperMiddleware.middlewareName}: Token is missing from authorization header`,
      );

      return ResponseServer.error(res, 401, 'Unauthorized. Please log in.');
    }

    let userId: string;

    try {
      const decodedHeader = jwt.decode(token, { complete: true });

      logger.debug(
        `${helperMiddleware.middlewareName} Token Header: ${JSON.stringify(decodedHeader?.header)}`,
      );

      const decoded = jwt.verify(token, env.SUPABASE_JWT_SECRET, {
        algorithms: ['HS256'],
      }) as jwt.JwtPayload;

      if (!decoded.sub) return ResponseServer.error(res, 401, 'Invalid token');

      userId = decoded.sub;
    } catch (err) {
      logger.warn(
        `${helperMiddleware.middlewareName}: Invalid or expired token ${(err as Error).message}`,
      );

      return ResponseServer.error(
        res,
        401,
        'Unauthenticated, please login. asdas',
      );
    }

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
        logger.warn(
          `${helperMiddleware.middlewareName}: User not found in database`,
        );
        return ResponseServer.error(res, 404, 'User not found in database');
      }

      await container.cacheService.set(
        cacheKey.userSession(userId),
        dbUser,
        helperMiddleware.USER_SESSION_CACHE_TTL,
      );
    }

    req.user = dbUser;

    next();
  } catch (error) {
    const err = error as Error;

    logger.error(`${helperMiddleware.middlewareName}: ${err.message}`);

    return ResponseServer.error(res, 500, err.message);
  }
};
