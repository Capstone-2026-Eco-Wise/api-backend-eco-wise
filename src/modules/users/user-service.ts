import type { Users } from '../../../generated/prisma/client.ts';
import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type { UserSignInType, UserSignUpType } from '../../types/user-type.ts';
import UserRepository from './user-repository.ts';

export default class UserService {
  private userRepository: UserRepository;
  private cache: CacheService;

  constructor() {
    this.userRepository = new UserRepository();
    this.cache = new CacheService();
  }

  registerUser = async ({
    full_name,
    email,
    password,
    username,
  }: UserSignUpType) => {
    logger.info(`[User Service]: Signing up user with email: ${email}`);

    const { data: userSignUp, error: errorUserSignUp } =
      await this.userRepository.signUpUser({
        email,
        full_name,
        password,
        username,
      });

    if (errorUserSignUp) {
      logger.error(`[User Service]: ${errorUserSignUp.message}`);

      throw ErrorFactory.clientError(
        errorUserSignUp.message,
        errorUserSignUp.status,
      );
    }

    logger.info(`[User Service]: User signed up successfully for ${email}`);

    return userSignUp;
  };

  loginUser = async ({ email, password }: UserSignInType) => {
    logger.info(`[User Service]: Logging in user with email: ${email}`);

    const { data: userSignIn, error: errorUserSignIn } =
      await this.userRepository.signInUser({ email, password });

    if (errorUserSignIn) {
      logger.error(`[User Service]: ${errorUserSignIn.message}`);

      throw ErrorFactory.clientError(
        errorUserSignIn.message,
        errorUserSignIn.status,
      );
    }

    logger.info(`[User Service]: User logged in successfully for ${email}`);

    return userSignIn;
  };

  sessionUser = async (user: Users) => {
    logger.info(`[User Service]: Getting session user for ${user.id}`);

    const cacheSession = await this.cache.get(cacheKey.userSession(user.id));

    if (cacheSession) {
      logger.info(`[User Service]: Get session from cache for ${user.id}`);

      return { user: cacheSession, fromCache: true };
    }

    await this.cache.set(cacheKey.userSession(user.id), user);

    logger.info(`[User Service]: Get user for ${user.id}`);

    return { user, fromCache: false };
  };

  logoutUser = async (userId: string) => {
    logger.info(`[User Service]: User is logging out`);

    const { error: errorUserLogOut } = await this.userRepository.userLogOut();

    if (errorUserLogOut) {
      logger.error(`[User Service]: ${errorUserLogOut.message}`);

      throw ErrorFactory.clientError(
        errorUserLogOut.message,
        errorUserLogOut.status,
      );
    }

    await this.cache.del(cacheKey.userSession(userId));

    logger.info(`[User Service]: User has been logged out`);

    return 'User has been logged out';
  };
}
