import type { Users } from '../../../generated/prisma/client.ts';
import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type EcoPointsService from '../eco-points/eco-points-service.ts';
import type { default as AuthRepository } from './auth-repository.ts';
import type { AuthSignInType, AuthSignUpType } from './auth-type.ts';

export default class AuthService {
  private authRepository: AuthRepository;
  private ecoPointsService: EcoPointsService;
  private cache: CacheService;
  private serviceName: string;

  constructor(
    authRepository: AuthRepository,
    ecoPointsService: EcoPointsService,
    cache: CacheService,
  ) {
    this.authRepository = authRepository;
    this.ecoPointsService = ecoPointsService;
    this.cache = cache;
    this.serviceName = '[Auth Service]';
  }

  authSignUp = async ({
    fullName,
    email,
    password,
    username,
  }: AuthSignUpType) => {
    try {
      logger.info(
        `${this.serviceName}: Registering new user with email: ${email}`,
      );

      const { data: authSignUp, error: errorauthSignUp } =
        await this.authRepository.signUp({
          email,
          fullName,
          password,
          username,
        });

      if (errorauthSignUp || !authSignUp) {
        throw ErrorFactory.clientError(
          errorauthSignUp?.message as string,
          errorauthSignUp?.status as number,
        );
      }

      const ecoPoints = await this.ecoPointsService.createDefaultPointUser(
        authSignUp.user?.id as string,
      );

      if (!ecoPoints) {
        throw ErrorFactory.serverError('Error creating default point for user');
      }

      logger.info(
        `${this.serviceName}: User signed up successfully for ${email}`,
      );

      return { ...authSignUp, ecoPoints };
    } catch (error) {
      ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  authSignIn = async ({ email, password }: AuthSignInType) => {
    try {
      logger.info(`${this.serviceName}: Sign In user with email: ${email}`);

      const { data: authSignIn, error: errorAuthSignIn } =
        await this.authRepository.signIn({ email, password });

      if (errorAuthSignIn) {
        throw ErrorFactory.clientError(
          errorAuthSignIn.message,
          errorAuthSignIn.status,
        );
      }

      await this.cache.del(cacheKey.userSession(authSignIn.user.id));

      logger.info(
        `${this.serviceName}: User logged in successfully for ${email}`,
      );

      return authSignIn;
    } catch (error) {
      ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  authSignOut = async (user: Users) => {
    try {
      logger.info(`${this.serviceName}: User sign out`);

      const { error: errorAuthLogOut } = await this.authRepository.signOut();

      if (errorAuthLogOut) {
        throw ErrorFactory.clientError(
          errorAuthLogOut.message,
          errorAuthLogOut.status,
        );
      }

      // Clean up cache
      logger.info(`[CLEAN UP CACHE]: for user ${user.id}`);
      await this.cache.del(cacheKey.userSession(user.id));
      await this.cache.del(cacheKey.ecoPoints(user.id));
      await this.cache.del(cacheKey.scanHistory(user.id));

      logger.info(`${this.serviceName}: User has been signed out`);

      return {
        success: true,
        message: 'User has been signed out',
      };
    } catch (error) {
      ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };
}
