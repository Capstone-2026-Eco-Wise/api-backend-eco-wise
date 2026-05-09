import type { Prisma } from '../../../generated/prisma/client.ts';
import { prisma } from '../../infrastructure/database/prisma-client.ts';
import type {
  CreateWasteCategoriesType,
  UpdateWasteCategoriesType,
} from './waste-categories-type.ts';

export default class WasteCategoriesRepository {
  create = async (
    {
      categoryCode,
      categoryName,
      colorHex,
      description,
      handlingTips,
      pointsReward,
    }: CreateWasteCategoriesType,
    option?: Prisma.wasteCategoriesCreateArgs,
  ) => {
    return await prisma.wasteCategories.create({
      data: {
        categoryCode,
        categoryName,
        colorHex,
        pointsReward,
        description,
        handlingTips,
      },
      ...option,
    });
  };

  getAll = async (option?: Prisma.wasteCategoriesFindManyArgs) => {
    return await prisma.wasteCategories.findMany({
      ...option,
    });
  };

  getById = async (
    id: string,
    option?: Prisma.wasteCategoriesFindUniqueArgs,
  ) => {
    return await prisma.wasteCategories.findUnique({
      where: {
        id,
      },
      ...option,
    });
  };

  update = async (
    {
      id,
      categoryName,
      colorHex,
      description,
      handlingTips,
      pointsReward,
    }: UpdateWasteCategoriesType,
    option?: Prisma.wasteCategoriesUpdateArgs,
  ) => {
    return await prisma.wasteCategories.update({
      where: {
        id,
      },
      data: {
        categoryName,
        colorHex,
        description,
        handlingTips,
        pointsReward,
      },

      ...option,
    });
  };

  delete = async (id: string) => {
    return await prisma.wasteCategories.delete({
      where: {
        id,
      },
    });
  };

  getCategoriesByCode = async (categoryCode: string) => {
    return await prisma.wasteCategories.findUnique({
      where: { categoryCode },
    });
  };
}
