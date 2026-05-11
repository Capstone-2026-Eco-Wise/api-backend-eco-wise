import { prisma } from '../../infrastructure/database/prisma-client.ts';
import type {
  CheckIsOwnerType,
  CreateFaqType,
  DeleteFaqType,
  FilterFaqType,
  GetFaqByCreatorType,
  QueryFaqType,
  UpdateFaqType,
} from './faqs-type.ts';

export default class FaqsRepository {
  private filterFAQArgs = ({
    whereOption = {},
    selectOption = {
      id: true,
      question: true,
      answer: true,
      category: true,
      orderNumber: true,
      isActive: true,
      createdAt: true,
    },
    orderByOption = [],
  }: FilterFaqType) => {
    return {
      where: whereOption,
      select: selectOption,
      orderBy: orderByOption,
    };
  };

  checkIsOwner = async ({ id, createdBy }: CheckIsOwnerType) => {
    const isOwner = await prisma.faqs.findFirst({
      where: {
        id,
        createdBy,
      },
      select: {
        id: true,
        createdBy: true,
      },
    });

    if (!isOwner) {
      return {
        isOwner: false,
        message: 'You are not the owner of this FAQ',
      };
    }

    return {
      isOwner: true,
      message: 'You are the owner of this FAQ',
    };
  };

  createFAQ = async ({
    question,
    answer,
    category,
    orderNumber,
    isActive,
    createdBy,
  }: CreateFaqType) => {
    return await prisma.faqs.create({
      data: {
        question,
        answer,
        category,
        orderNumber,
        isActive,
        createdBy,
      },
    });
  };

  getAllFAQsPublic = async ({ category }: QueryFaqType) => {
    const { orderBy, select, where } = this.filterFAQArgs({
      whereOption: {
        isActive: true,
        ...(category && {
          category: {
            contains: category,
            mode: 'insensitive',
          },
        }),
      },
      selectOption: {
        id: true,
        question: true,
        answer: true,
        category: true,
        orderNumber: true,
        isActive: true,
        createdAt: true,
      },
      orderByOption: [
        {
          category: 'asc',
        },
        {
          orderNumber: 'asc',
        },
      ],
    });

    return await prisma.faqs.findMany({
      where,
      select,
      orderBy,
    });
  };

  getAllFAQsByCreator = async ({ createdBy }: GetFaqByCreatorType) => {
    const { where, orderBy } = this.filterFAQArgs({
      whereOption: {
        createdBy,
      },
      orderByOption: [
        {
          category: 'asc',
        },
        {
          orderNumber: 'asc',
        },
      ],
    });

    return await prisma.faqs.findMany({
      where,
      orderBy,
    });
  };

  updateFAQ = async ({
    id,
    answer,
    category,
    isActive,
    orderNumber,
    question,
    createdBy,
    updatedBy,
  }: UpdateFaqType) => {
    return await prisma.faqs.update({
      where: {
        id,
      },
      data: {
        ...(question !== undefined && { question }),
        ...(answer !== undefined && { answer }),
        ...(category !== undefined && { category }),
        ...(isActive !== undefined && { isActive }),
        ...(orderNumber !== undefined && { orderNumber }),
        ...(createdBy !== undefined && { createdBy: createdBy || null }),
        ...(updatedBy !== undefined && { updatedBy }),
      },
    });
  };

  deleteFAQByCreator = async ({ id }: DeleteFaqType) => {
    return await prisma.faqs.delete({
      where: {
        id,
      },
    });
  };
}
