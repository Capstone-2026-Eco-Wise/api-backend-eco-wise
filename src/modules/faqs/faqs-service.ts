import type { users } from '../../../generated/prisma/client.ts';
import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type FaqsRepository from './faqs-repository.ts';
import type {
  CreateFaqType,
  DeleteFaqType,
  QueryFaqType,
  UpdateFaqType,
} from './faqs-type.ts';

export default class FaqsService {
  private faqsRepository: FaqsRepository;
  private cache: CacheService;
  private serviceName: string;

  constructor(faqsRepository: FaqsRepository, cache: CacheService) {
    this.faqsRepository = faqsRepository;
    this.cache = cache;
    this.serviceName = '[FAQS Service]';
  }

  createFAQ = async ({
    question,
    answer,
    category,
    orderNumber,
    isActive,
    createdBy,
  }: CreateFaqType) => {
    try {
      logger.info(`${this.serviceName}: Creating FAQ by User ID: ${createdBy}`);

      const faqs = await this.faqsRepository.createFAQ({
        question,
        answer,
        category,
        orderNumber,
        isActive,
        createdBy,
      });

      if (!faqs) {
        throw ErrorFactory.clientError('Failed to create FAQ');
      }

      await this.cache.del(cacheKey.faqsPublic());
      await this.cache.del(cacheKey.faqsByCreator(createdBy as string));

      logger.info(`${this.serviceName}: FAQ created successfully`);

      return faqs;
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  getFAQSForPublic = async ({ category }: QueryFaqType) => {
    try {
      logger.info(`${this.serviceName}: Getting FAQs for public`);

      const key = cacheKey.faqsPublic();

      if (!category) {
        const cachedFaqs = await this.cache.get(key);

        if (cachedFaqs) {
          logger.info(
            `${this.serviceName}: FAQs for public retrieved from cache`,
          );

          return {
            faqs: cachedFaqs,
            fromCache: true,
          };
        }
      }

      const faqs = await this.faqsRepository.getAllFAQsPublic({
        category: category as string,
      });

      if (faqs.length === 0) {
        throw ErrorFactory.notFoundError('FAQs not found');
      }

      if (!category) {
        await this.cache.set(key, faqs, 60 * 60);
      }

      logger.info(
        `${this.serviceName}: FAQs for public retrieved from database`,
      );

      return {
        faqs,
        fromCache: false,
      };
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  getFAQSByCreator = async (user: users) => {
    try {
      logger.info(`${this.serviceName}: Getting FAQs by creator`);

      const key = cacheKey.faqsByCreator(user.id);

      const cachedFaqs = await this.cache.get(key);

      if (cachedFaqs) {
        logger.info(
          `${this.serviceName}: FAQs for creator retrieved from cache`,
        );

        return {
          faqs: cachedFaqs,
          fromCache: true,
        };
      }

      const faqs = await this.faqsRepository.getAllFAQsByCreator({
        createdBy: user.id,
      });

      if (faqs.length === 0) {
        throw ErrorFactory.notFoundError('FAQs not found');
      }

      await this.cache.set(key, faqs, 60 * 60);

      logger.info(
        `${this.serviceName}: FAQs for creator retrieved from database`,
      );

      return {
        faqs,
        fromCache: false,
      };
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  updateFAQByCreator = async (params: UpdateFaqType) => {
    try {
      logger.info(`${this.serviceName}: Updating FAQ by creator`);

      const { isOwner, message } = await this.faqsRepository.checkIsOwner({
        id: params.id as string,
        createdBy: params.createdBy as string,
      });

      if (!isOwner) {
        throw ErrorFactory.clientError(message);
      }

      const faqs = await this.faqsRepository.updateFAQ(params);

      if (!faqs) {
        throw ErrorFactory.notFoundError('FAQ not found');
      }

      await this.cache.del(cacheKey.faqsPublic());
      await this.cache.del(cacheKey.faqsByCreator(params.createdBy as string));

      logger.info(`${this.serviceName}: FAQ updated successfully`);

      return faqs;
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  deleteFAQCreator = async ({ id, createdBy }: DeleteFaqType) => {
    try {
      logger.info(`${this.serviceName}: Deleting FAQ by creator`);

      const { isOwner, message } = await this.faqsRepository.checkIsOwner({
        id,
        createdBy: createdBy as string,
      });

      if (!isOwner) {
        throw ErrorFactory.clientError(message);
      }

      const faq = await this.faqsRepository.deleteFAQByCreator({
        id,
        createdBy: createdBy as string,
      });

      if (!faq) {
        throw ErrorFactory.notFoundError('FAQ not found');
      }

      await this.cache.del(cacheKey.faqsPublic());
      await this.cache.del(cacheKey.faqsByCreator(createdBy as string));

      logger.info(`${this.serviceName}: FAQ deleted successfully`);

      return faq;
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };
}
