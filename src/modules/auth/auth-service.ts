import type { users } from '../../../generated/prisma/client.ts';
import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type EcoPointsService from '../eco-points/eco-points-service.ts';
import type { default as AuthRepository } from './auth-repository.ts';
import type {
  AuthSignInType,
  AuthSignUpType,
  AuthServiceUpdatePasswordType,
} from './auth-type.ts';

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

    try {
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
        throw ErrorFactory.clientError('Error creating default point for user');
      }

      await this.cache.del(cacheKey.dashboardStats());

      logger.info(
        `${this.serviceName}: User signed up successfully for ${email}`,
      );

      return { ...authSignUp, ecoPoints };
    } catch (error) {
      await this.authRepository.deleteUserFromSupabase(
        authSignUp.user?.id as string,
      );
      throw ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
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
      throw ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  updatePassword = async ({
    userId,
    email,
    oldPassword,
    newPassword,
    confirmPassword,
  }: AuthServiceUpdatePasswordType) => {
    try {
      logger.info(`${this.serviceName}: Updating password for user ${userId}`);

      if (oldPassword === newPassword) {
        throw ErrorFactory.clientError(
          'New password must be different from the old password',
          400,
        );
      }

      if (newPassword !== confirmPassword) {
        throw ErrorFactory.clientError(
          'New password and confirm password do not match',
        );
      }

      const { error: errorAuthSignIn } = await this.authRepository.signIn({
        email,
        password: oldPassword,
      });

      if (errorAuthSignIn) {
        throw ErrorFactory.clientError('Old password is incorrect', 400);
      }

      const { error: errorAuthUpdatePassword } =
        await this.authRepository.updatePassword({
          userId,
          password: newPassword,
        });

      if (errorAuthUpdatePassword) {
        throw ErrorFactory.clientError(
          errorAuthUpdatePassword.message,
          errorAuthUpdatePassword.status,
        );
      }

      await this.cache.del(cacheKey.userSession(userId));

      // Obtain a new session because updating password revokes the old token
      const { data: newSession, error: newSessionError } =
        await this.authRepository.signIn({
          email,
          password: newPassword,
        });

      if (newSessionError) {
        throw ErrorFactory.clientError(
          'Password updated, but failed to automatically log in. Please log in manually.',
        );
      }

      logger.info(
        `${this.serviceName}: Password updated successfully for user ${userId}`,
      );

      return newSession;
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  authSignOut = async (user: users, accessToken: string) => {
    try {
      logger.info(`${this.serviceName}: User sign out`);

      const { error: errorAuthLogOut } =
        await this.authRepository.signOut(accessToken);

      if (errorAuthLogOut) {
        throw ErrorFactory.clientError(
          errorAuthLogOut.message,
          errorAuthLogOut.status,
        );
      }

      // Clean up cache and add token to blacklist
      logger.info(`[CLEAN UP CACHE]: for user ${user.id}`);
      await Promise.all([
        this.cache.set(cacheKey.blacklistedToken(accessToken), 'revoked', 24),
        this.cache.del(cacheKey.userSession(user.id)),
        this.cache.del(cacheKey.ecoPoints(user.id)),
        this.cache.del(cacheKey.scanHistory(user.id)),
        this.cache.del(cacheKey.faqsByCreator(user.id)),
      ]);

      logger.info(`${this.serviceName}: User has been signed out`);

      return {
        success: true,
        message: 'User has been signed out',
      };
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  authSignUpAdmin = async ({
    fullName,
    email,
    password,
    username,
  }: AuthSignUpType) => {
    try {
      logger.info(
        `${this.serviceName}: Registering new admin with email: ${email}`,
      );

      const { session, user } = await this.authRepository.signUpRoleAdmin({
        email,
        fullName,
        password,
        username,
      });

      if (!session || !user) {
        throw ErrorFactory.clientError('Failed to register admin');
      }

      await this.cache.del(cacheKey.dashboardStats());

      logger.info(
        `${this.serviceName}: Admin registered successfully for ${email}`,
      );

      const responseAdminSignUp = {
        user,
        session: {
          access_token: session.access_token,
          token_type: session.token_type,
          expires_in: session.expires_in,
          expires_at: session.expires_at,
          refresh_token: session.refresh_token,
        },
      };

      return responseAdminSignUp;
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };
}
