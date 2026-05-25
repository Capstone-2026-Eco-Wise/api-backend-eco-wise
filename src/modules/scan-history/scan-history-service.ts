import type { users } from '../../../generated/prisma/client.ts';
import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type AiService from '../../services/ai-service.ts';
import { handleTransaction } from '../../services/prisma-transaction.ts';
import type StorageService from '../../services/storage-service.ts';
import { storageConfig } from '../../services/storage-service.ts';
import type UserRepository from '../users/user-repository.ts';
import type WasteCategoriesRepository from '../waste-categories/waste-categories-repository.ts';
import type ScanHistoryRepository from './scan-history-repository.ts';
import type { ProcessScanHistoryType } from './scan-history-type.ts';

export default class ScanHistoryService {
  private scanHistoryRepository: ScanHistoryRepository;
  private wasteCategoriesRepository: WasteCategoriesRepository;
  private userRepository: UserRepository;
  private aiService: AiService;
  private storageService: StorageService;
  private cache: CacheService;
  private serviceName: string;

  constructor(
    scanHistoryRepository: ScanHistoryRepository,
    wasteCategoriesRepository: WasteCategoriesRepository,
    userRepository: UserRepository,
    aiService: AiService,
    storageService: StorageService,
    cache: CacheService,
  ) {
    this.scanHistoryRepository = scanHistoryRepository;
    this.wasteCategoriesRepository = wasteCategoriesRepository;
    this.userRepository = userRepository;
    this.aiService = aiService;
    this.storageService = storageService;
    this.cache = cache;
    this.serviceName = '[Scan History Service]';
  }

  private processScanAndUpload = async (
    userAiToken: number,
    file: Express.Multer.File,
  ) => {
    let uploadedFileUrl: string | undefined;

    try {
      const [uploadResult, responsePredictModel] = await Promise.all([
        this.storageService.uploadImageToSupabase(
          file,
          storageConfig.bucketName,
          storageConfig.scannedMedia,
        ),
        this.aiService.classifyImage(file, userAiToken),
      ]);

      uploadedFileUrl = uploadResult.publicUrl;

      return { responsePredictModel, uploadedFileUrl };
    } catch (error) {
      if (uploadedFileUrl) {
        this.storageService
          .deleteFileFromSupabase(uploadedFileUrl)
          .catch((cleanupError) => {
            logger.error(
              `${this.serviceName}: Failed to delete orphan file in Supabase`,
              cleanupError,
            );
          });
      }

      return ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  processScanImage = async ({ user, file }: ProcessScanHistoryType) => {
    try {
      logger.info(`${this.serviceName}: processing user scan`);

      if (user.aiTokens < 0) {
        logger.warn(
          `${this.serviceName}: Token user is negative, should not happen`,
        );

        throw ErrorFactory.clientError('Token is negative', 400);
      }

      // Proses Scan and Upload Image to Supabase Storage
      const { uploadedFileUrl, responsePredictModel } =
        await this.processScanAndUpload(user.aiTokens, file);

      const { aiResult, category, scanHistory, tokenUserRemaining } =
        await handleTransaction(async (tx) => {
          const updatedTokenUser = await this.userRepository.updateTokenUser(
            {
              aiTokens: user.aiTokens,
              id: user.id,
            },
            tx,
          );

          logger.debug(
            `${this.serviceName}: User ${updatedTokenUser.id} token update ${updatedTokenUser.aiTokens}`,
          );

          const wasteCategory =
            await this.wasteCategoriesRepository.getCategoriesByCode(
              responsePredictModel.label.toUpperCase(),
            );

          logger.debug(
            `${this.serviceName}: Waste category ${wasteCategory?.categoryCode} `,
          );

          if (!wasteCategory) {
            logger.warn(
              `${this.serviceName}: Category '${responsePredictModel.label}' not found`,
            );

            throw ErrorFactory.clientError(
              `Category '${responsePredictModel.label}' not found`,
              404,
            );
          }

          const scanHistory = await this.scanHistoryRepository.createScan(
            {
              userId: user.id,
              categoryId: wasteCategory.id,
              imageUrl: uploadedFileUrl,
              confidenceScore: responsePredictModel.confidence,
              rawPredictions: responsePredictModel.all_scores,
              pointEarned: wasteCategory.pointsReward,
              scannedAt: new Date(),
            },
            tx,
          );

          if (!scanHistory) {
            throw ErrorFactory.clientError('Failed to create scan history');
          }

          return {
            scanHistory,
            tokenUserRemaining: {
              id: updatedTokenUser.id,
              username: user.username,
              aiToken: updatedTokenUser.aiTokens,
            },
            category: {
              category: wasteCategory.categoryCode,
              points: wasteCategory.pointsReward,
            },
            aiResult: {
              labelAi: responsePredictModel.label,
              tips: responsePredictModel.tips_daur_ulang,
              latency: responsePredictModel.latency_ms,
            },
          };
        });

      await Promise.all([
        this.cache.del(cacheKey.scanHistory(user.id)),
        this.cache.del(cacheKey.userSession(user.id)),
      ]);

      logger.info(`${this.serviceName}: scan history created successfully`);

      return {
        scanHistory,
        tokenUserRemaining,
        category,
        aiResult,
      };
    } catch (error) {
      return ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  getScanHistoryUser = async (user: users) => {
    try {
      const scanHistoryCached = await this.cache.get(
        cacheKey.scanHistory(user.id),
      );

      if (scanHistoryCached) {
        return { scanHistory: scanHistoryCached, fromCache: true };
      }

      const scanHistory = await this.scanHistoryRepository.getHistoryScan(
        user.id,
      );

      if (scanHistory.length === 0) {
        throw ErrorFactory.clientError('Scan history not found', 404);
      }

      await this.cache.set(cacheKey.scanHistory(user.id), scanHistory);

      return { scanHistory, fromCache: false };
    } catch (error) {
      return ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  getScanHistoryDetail = async (id: string, user: users) => {
    try {
      logger.info(`${this.serviceName} processing get scan history detail`);

      const scanHistory = await this.scanHistoryRepository.getHistoryScanById(
        id,
        user.id,
      );

      if (!scanHistory) {
        throw ErrorFactory.clientError('Scan history not found', 404);
      }

      logger.info(
        `${this.serviceName}: scan history detail fetched successfully`,
      );

      return scanHistory;
    } catch (error) {
      return ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };
}
