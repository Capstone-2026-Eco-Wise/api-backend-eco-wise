import type { users } from '../../../generated/prisma/client.ts';
import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type StorageService from '../../services/storage-service.ts';
import { storageConfig } from '../../services/storage-service.ts';
import type UserRepository from './user-repository.ts';
import type {
  QueryParamUserType,
  ResetTokenUserType,
  UpdateProfileUserType,
  UpdateRoleUserType,
  UserUpdateAvatarType,
} from './user-type.ts';

export default class UserService {
  private userRepository: UserRepository;
  private storageService: StorageService;
  private cache: CacheService;
  private serviceName: string;
  private static readonly sessionCacheTtl = 60 * 15;

  constructor(
    userRepository: UserRepository,
    storageService: StorageService,
    cache: CacheService,
  ) {
    this.userRepository = userRepository;
    this.storageService = storageService;
    this.cache = cache;
    this.serviceName = '[User Service]';
  }

  private cleanUpCacheUser = async (id: string) => {
    return await Promise.all([
      this.cache.del(cacheKey.userSession(id)),
      this.cache.del(cacheKey.ecoPoints(id)),
      this.cache.del(cacheKey.scanHistory(id)),
      this.cache.del(cacheKey.faqsByCreator(id)),
    ]);
  };

  sessionUser = async (user: users) => {
    try {
      logger.info(`${this.serviceName}: Getting session user for ${user.id}`);

      const cacheSession = await this.cache.get(cacheKey.userSession(user.id));

      if (cacheSession) {
        return { user: cacheSession, fromCache: true };
      }

      await this.cache.set(
        cacheKey.userSession(user.id),
        user,
        UserService.sessionCacheTtl,
      );

      logger.info(`${this.serviceName}: Get user for ${user.id}`);

      return { user, fromCache: false };
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  getAllUsers = async ({
    id,
    limit,
    page,
    role,
    search,
  }: QueryParamUserType) => {
    try {
      logger.info(
        `${this.serviceName}: Getting all users for ${role}, ${search}`,
      );

      const users = await this.userRepository.getAllUsers({
        id,
        limit,
        page,
        role,
        search,
      });

      if (users.data.length === 0) {
        throw ErrorFactory.notFoundError('Users not found');
      }

      logger.info(`${this.serviceName}: Get all users successfully`);

      return users;
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  updateAvatarUser = async ({ user, file }: UserUpdateAvatarType) => {
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

      const userUpdated = await this.userRepository.updateAvatarUser({
        id: user.id as string,
        avatarUrl: newPublicUrl,
      });

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

      throw ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  updateProfile = async ({ id, fullName }: UpdateProfileUserType) => {
    try {
      logger.info(`${this.serviceName}: user update profile ${id}`);

      const updateProfile = await this.userRepository.updateProfileUser({
        id,
        fullName,
      });

      if (!updateProfile) {
        throw ErrorFactory.clientError('Update profile failed');
      }

      await this.cache.del(cacheKey.userSession(id));

      return updateProfile;
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  updateRoleUser = async ({ id, role }: UpdateRoleUserType) => {
    try {
      logger.info(`${this.serviceName}: user update role ${id}`);

      const user = await this.userRepository.getUserById(id);

      if (!user) {
        throw ErrorFactory.notFoundError('User not found');
      }

      if (user.role === role) {
        throw ErrorFactory.clientError(`User already has this role`);
      }

      const updateRole = await this.userRepository.updateRoleUser({
        id,
        role,
      });

      if (!updateRole) {
        throw ErrorFactory.clientError('Update role failed');
      }

      await this.cache.del(cacheKey.userSession(id));

      return updateRole;
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  resetTokenUser = async ({ id, nextReset }: ResetTokenUserType) => {
    try {
      logger.info(`${this.serviceName}: Resetting token for user ${id}`);

      const resetTokenUser = await this.userRepository.userResetToken({
        id,
        nextReset,
      });

      if (!resetTokenUser) {
        logger.warn(`${this.serviceName}: Reset token failed for user ${id}`);

        throw ErrorFactory.clientError('Failed to reset token');
      }

      logger.info(
        `${this.serviceName}: Reset token successfully for user ${id}`,
      );

      await this.cache.set(cacheKey.userSession(id), resetTokenUser, 60 * 15);

      return resetTokenUser;
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  deletedUser = async (id: string) => {
    try {
      logger.info(`${this.serviceName}: Deleting user ${id}`);

      const [user] = await this.userRepository.deleteUser(id);

      if (!user) {
        throw ErrorFactory.notFoundError('User not found');
      }

      await this.cleanUpCacheUser(id);

      await this.cache.del(cacheKey.dashboardStats());

      logger.info(`${this.serviceName}: Delete user successfully ${id}`);

      return user;
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };
}
