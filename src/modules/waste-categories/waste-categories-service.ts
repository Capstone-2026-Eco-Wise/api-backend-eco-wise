import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type WasteCategoriesRepository from './waste-categories-repository.ts';
import type {
  CreateWasteCategoriesType,
  UpdateWasteCategoriesType,
} from './waste-categories-type.ts';

export default class WasteCategoriesService {
  private wasteCategoriesRepository: WasteCategoriesRepository;
  private cache: CacheService;
  private serviceName: string;

  constructor(
    wasteCategoriesRepository: WasteCategoriesRepository,
    cache: CacheService,
  ) {
    this.wasteCategoriesRepository = wasteCategoriesRepository;
    this.cache = cache;
    this.serviceName = '[Waste Categories Service]';
  }

  createWasteCategory = async ({
    categoryCode,
    categoryName,
    colorHex,
    description,
    handlingTips,
    pointsReward,
  }: CreateWasteCategoriesType) => {
    try {
      logger.info(
        `${this.serviceName}: Creating waste category with category code ${categoryCode}`,
      );

      const categoryCodeGenerate = categoryCode
        .split(' ')
        .join('_')
        .trim()
        .toUpperCase();

      const isExist = await this.wasteCategoriesRepository.findCategoryCode({
        categoryCode: categoryCodeGenerate,
      });

      if (isExist) {
        throw ErrorFactory.clientError('Category Code is already exist', 409);
      }

      const resultCreate = await this.wasteCategoriesRepository.create({
        categoryCode: categoryCodeGenerate,
        categoryName,
        colorHex,
        description,
        handlingTips,
        pointsReward,
      });

      if (!resultCreate) {
        throw ErrorFactory.clientError('Failed to create waste category', 400);
      }

      await this.cache.del(cacheKey.wasteCategories());
      await this.cache.del(cacheKey.dashboardStats());

      logger.info(`${this.serviceName}: End create waste category`);

      return resultCreate;
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  getAllWasteCategories = async () => {
    try {
      logger.info(`${this.serviceName}: Getting all waste categories`);

      const wasteCategoriesCached = await this.cache.get(
        cacheKey.wasteCategories(),
      );

      if (wasteCategoriesCached) {
        return { wasteCategories: wasteCategoriesCached, fromCache: true };
      }

      const wasteCategories = await this.wasteCategoriesRepository.getAll({
        orderBy: {
          categoryCode: 'asc',
        },
      });

      if (wasteCategories.length === 0) {
        throw ErrorFactory.notFoundError('Waste Categories is Empty');
      }

      await this.cache.set(cacheKey.wasteCategories(), wasteCategories);

      logger.info(`${this.serviceName}: End getting all waste categories`);

      return { wasteCategories, fromCache: false };
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  getWasteCategoryById = async (wasteCategoryId: string) => {
    try {
      logger.info(
        `${this.serviceName}: Getting waste category by id ${wasteCategoryId}`,
      );

      const wasteCategoryById =
        await this.wasteCategoriesRepository.getById(wasteCategoryId);

      if (!wasteCategoryById) {
        throw ErrorFactory.notFoundError('Waste Category is Not Found');
      }

      logger.info(`${this.serviceName}: End getting waste category by id`);

      return wasteCategoryById;
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  updateWasteCategory = async ({
    id,
    categoryName,
    description,
    handlingTips,
    colorHex,
    pointsReward,
  }: UpdateWasteCategoriesType) => {
    try {
      logger.info(`${this.serviceName}: Updating waste category`);

      const wasteCategoryUpdate = await this.wasteCategoriesRepository.update({
        id,
        categoryName,
        description,
        handlingTips,
        colorHex,
        pointsReward,
      });

      await this.cache.del(cacheKey.wasteCategories());

      logger.info(`${this.serviceName}: End update waste category`);

      return wasteCategoryUpdate;
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  deleteWasteCategory = async (wasteCategoryId: string) => {
    try {
      logger.info(`${this.serviceName}: Deleting waste category`);

      const wasteCategoryDelete =
        await this.wasteCategoriesRepository.delete(wasteCategoryId);

      if (!wasteCategoryDelete) {
        throw ErrorFactory.notFoundError('Waste Category is Not Found');
      }

      await this.cache.del(cacheKey.wasteCategories());
      await this.cache.del(cacheKey.dashboardStats());

      logger.info(`${this.serviceName}: End delete waste category`);

      return wasteCategoryDelete;
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };
}
