import type { Users } from '../../../generated/prisma/client.ts';
import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type StorageService from '../../services/storage-service.ts';
import { storageConfig } from '../../services/storage-service.ts';
import type { UserSignInType, UserSignUpType } from '../../types/user-type.ts';
import type EcoPointsService from '../eco-points/eco-points-service.ts';
import type UserRepository from './user-repository.ts';

export default class UserService {
  private userRepository: UserRepository;
  private ecoPointsService: EcoPointsService;
  private storageService: StorageService;
  private cache: CacheService;
  private serviceName: string;

  constructor(
    userRepository: UserRepository,
    ecoPointsService: EcoPointsService,
    storageService: StorageService,
    cache: CacheService,
  ) {
    this.userRepository = userRepository;
    this.ecoPointsService = ecoPointsService;
    this.storageService = storageService;
    this.cache = cache;
    this.serviceName = '[User Service]';
  }

  registerUser = async ({
    full_name,
    email,
    password,
    username,
  }: UserSignUpType) => {
    try {
      logger.info(`${this.serviceName}: Signing up user with email: ${email}`);

      const { data: userSignUp, error: errorUserSignUp } =
        await this.userRepository.signUpUser({
          email,
          full_name,
          password,
          username,
        });

      if (errorUserSignUp || !userSignUp) {
        throw ErrorFactory.clientError(
          errorUserSignUp?.message as string,
          errorUserSignUp?.status as number,
        );
      }

      const ecoPoints = await this.ecoPointsService.createDefaultPointUser(
        userSignUp.user?.id as string,
      );

      if (!ecoPoints) {
        throw ErrorFactory.serverError('Error creating default point for user');
      }

      logger.info(
        `${this.serviceName}: User signed up successfully for ${email}`,
      );

      return { ...userSignUp, ecoPoints };
    } catch (error) {
      ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  loginUser = async ({ email, password }: UserSignInType) => {
    try {
      logger.info(`${this.serviceName}: Logging in user with email: ${email}`);

      const { data: userSignIn, error: errorUserSignIn } =
        await this.userRepository.signInUser({ email, password });

      if (errorUserSignIn) {
        throw ErrorFactory.clientError(
          errorUserSignIn.message,
          errorUserSignIn.status,
        );
      }

      logger.info(
        `${this.serviceName}: User logged in successfully for ${email}`,
      );

      return userSignIn;
    } catch (error) {
      ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  sessionUser = async (user: Users) => {
    try {
      logger.info(`${this.serviceName}: Getting session user for ${user.id}`);

      const cacheSession = await this.cache.get(cacheKey.userSession(user.id));

      if (cacheSession) {
        return { user: cacheSession, fromCache: true };
      }

      await this.cache.set(cacheKey.userSession(user.id), user);

      logger.info(`${this.serviceName}: Get user for ${user.id}`);

      return { user, fromCache: false };
    } catch (error) {
      ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  updateAvatarUser = async (user: Users, file: Express.Multer.File) => {
    let newPublicUrl: string | null = null;
    try {
      logger.info(`${this.serviceName}: Updating avatar for user ${user.id}`);

      const { publicUrl } = await this.storageService.uploadImageToSupabase(
        file,
        storageConfig.bucketName,
        storageConfig.avatarUrl,
      );

      if (!publicUrl) {
        throw ErrorFactory.clientError('Failed to upload avatar');
      }

      newPublicUrl = publicUrl;

      const userUpdated = await this.userRepository.updateAvatarUser(
        user.id as string,
        newPublicUrl,
      );

      if (!userUpdated) {
        throw ErrorFactory.clientError('Failed to update avatar');
      }

      if (user.avatar_url) {
        this.storageService
          .deleteFileFromSupabase(user.avatar_url)
          .catch((err) => logger.error(`[Cleanup Error]: ${err.message}`));
      }

      await this.cache.del(cacheKey.userSession(userUpdated.id));

      logger.info(
        `${this.serviceName}: Update avatar successfully for ${user.id}`,
      );
      return userUpdated;
    } catch (error) {
      if (newPublicUrl) {
        this.storageService
          .deleteFileFromSupabase(newPublicUrl)
          .catch((err) => logger.error(`[Cleanup Error]: ${err.message}`));
      }
      ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  logoutUser = async (userId: string) => {
    try {
      logger.info(`${this.serviceName}: User is logging out`);

      const { error: errorUserLogOut } = await this.userRepository.userLogOut();

      if (errorUserLogOut) {
        throw ErrorFactory.clientError(
          errorUserLogOut.message,
          errorUserLogOut.status,
        );
      }

      // Clean up cache
      await this.cache.del(cacheKey.userSession(userId));
      await this.cache.del(cacheKey.ecoPoints(userId));

      logger.info(`${this.serviceName}: User has been logged out`);

      return {
        success: true,
        message: 'User has been logged out',
      };
    } catch (error) {
      ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };
}
