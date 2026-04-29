import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type {
  CreateWasteCategoriesType,
  UpdateWasteCategoriesType,
} from '../../types/waste-categories-type.ts';
import type WasteCategoriesRepository from './waste-categories-repository.ts';

export default class WasteCategoriesService {
  private wasteCategoriesRepository: WasteCategoriesRepository;
  private cache: CacheService;

  constructor(
    wasteCategoriesRepository: WasteCategoriesRepository,
    cache: CacheService,
  ) {
    this.wasteCategoriesRepository = wasteCategoriesRepository;
    this.cache = cache;
  }

  createWasteCategory = async ({
    categoryCode,
    categoryName,
    colorHex,
    description,
    handlingTips,
    pointsReward,
  }: CreateWasteCategoriesType) => {
    logger.info(
      `[Waste Categories Service]: Creating waste category with category code ${categoryCode}`,
    );

    const categoryCodeGenerate = categoryCode.trim().toUpperCase();

    const result = await this.wasteCategoriesRepository.create({
      categoryCode: categoryCodeGenerate,
      categoryName,
      colorHex,
      description,
      handlingTips,
      pointsReward,
    });

    if (!result) {
      logger.error(
        `[Waste Categories Service]: Failed to create waste category`,
      );

      throw ErrorFactory.clientError('Failed to create waste category', 400);
    }

    await this.cache.del(cacheKey.wasteCategories());

    logger.info('[Waste Categories Service]: End create waste category');

    return result;
  };

  getAllWasteCategories = async () => {
    logger.info(`[Waste Categories Service]: Getting all waste categories`);

    const wasteCategoriesCache = await this.cache.get(
      cacheKey.wasteCategories(),
    );

    if (wasteCategoriesCache) {
      return { wasteCategories: wasteCategoriesCache, fromCache: true };
    }

    const wasteCategories = await this.wasteCategoriesRepository.getAll({
      orderBy: {
        categoryCode: 'asc',
      },
    });

    if (wasteCategories.length === 0) {
      logger.warn(`[Waste Categories Service]: Waste categories is empty`);
      throw ErrorFactory.notFoundError('Waste Categories is Empty');
    }

    await this.cache.set(cacheKey.wasteCategories(), wasteCategories);

    logger.info(`[Waste Categories Service]: End getting all waste categories`);

    return { wasteCategories, fromCache: false };
  };

  getWasteCategoryById = async (wasteCategoryId: string) => {
    logger.info(
      `[Waste Categories Service]: Getting waste category by id ${wasteCategoryId}`,
    );

    const result =
      await this.wasteCategoriesRepository.getById(wasteCategoryId);

    if (!result) {
      logger.error(
        `[Waste Categories Service]: Failed to get waste category by id ${wasteCategoryId}`,
      );

      throw ErrorFactory.notFoundError('Waste Category is Not Found');
    }

    logger.info('[Waste Categories Service]: End getting waste category by id');

    return result;
  };

  updateWasteCategory = async ({
    id,
    categoryName,
    description,
    handlingTips,
    colorHex,
    pointsReward,
  }: UpdateWasteCategoriesType) => {
    logger.info('[Waste Categories Service]: Updating waste category');

    const result = await this.wasteCategoriesRepository.update({
      id,
      categoryName,
      description,
      handlingTips,
      colorHex,
      pointsReward,
    });

    await this.cache.del(cacheKey.wasteCategories());

    logger.info('[Waste Categories Service]: End update waste category');

    return result;
  };

  deleteWasteCategory = async (wasteCategoryId: string) => {
    logger.info('[Waste Categories Service]: Deleting waste category');

    const result = await this.wasteCategoriesRepository.delete(wasteCategoryId);

    await this.cache.del(cacheKey.wasteCategories());

    logger.info('[Waste Categories Service]: End delete waste category');

    return result;
  };
}
