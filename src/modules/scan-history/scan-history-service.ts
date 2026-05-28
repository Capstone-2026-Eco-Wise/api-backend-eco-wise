import type { users } from '../../../generated/prisma/client.ts';
import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type AiService from '../../services/ai-service.ts';
import { handleTransaction } from '../../services/prisma-transaction.ts';
import type StorageService from '../../services/storage-service.ts';
import { storageConfig } from '../../services/storage-service.ts';
import type { TransactionClient } from '../../types/transaction-type.ts';
import type UserRepository from '../users/user-repository.ts';
import type WasteCategoriesRepository from '../waste-categories/waste-categories-repository.ts';
import type ScanHistoryRepository from './scan-history-repository.ts';
import type {
  CreateScanHistoryType,
  ProcessScanHistoryType,
  ResponsePredictFromAiType,
} from './scan-history-type.ts';

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

  /**
   ** [Helper function] scan image and upload image to supabase
   * @param userAiToken - User AI token
   * @param file - Image file
   * @returns Response predict model and uploaded file URL
   */
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

      throw ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  /**
   ** [Helper function] Create scan history
   * @param CreateScanHistoryType - Scan history data
   * @param tx - Transaction client
   * @returns Scan history
   */
  private createScanHistory = async (
    {
      userId,
      categoryId,
      confidenceScore,
      imageUrl,
      pointEarned,
      rawPredictions,
      scannedAt,
    }: CreateScanHistoryType,
    tx: TransactionClient,
  ) => {
    const scanHistory = await this.scanHistoryRepository.createScan(
      {
        userId,
        categoryId,
        confidenceScore,
        imageUrl,
        pointEarned,
        rawPredictions,
        scannedAt,
      },
      tx,
    );

    if (!scanHistory) {
      throw ErrorFactory.clientError('Failed to create scan history');
    }

    return scanHistory;
  };

  /**
   ** [Helper function] Get waste category by label
   * @param label - Waste category label
   * @returns Waste category
   */
  private getWasteCategory = async (label: string) => {
    const labelFromAi = this.formatLabel(label);

    const category =
      await this.wasteCategoriesRepository.getCategoriesByCode(labelFromAi);

    if (!category) {
      logger.warn(`${this.serviceName}: Category '${labelFromAi}' not found`);

      throw ErrorFactory.clientError(
        `Category '${labelFromAi}' not found`,
        404,
      );
    }

    return category;
  };

  /**
   ** [Helper function] Format label from AI model to category code
   * @param label - Waste category label
   * @returns Formatted label
   */
  private formatLabel = (label: string) => {
    return label === 'Non-Waste' ? 'Bukan_Sampah' : label;
  };

  /**
   ** [Helper function] Build AI result
   * @param responsePredictModel - Response from AI model
   * @returns Formatted AI result
   */
  private buildAiResult = (responsePredictModel: ResponsePredictFromAiType) => {
    return {
      persen: `${Math.round(Number(responsePredictModel.confidence) * 100)}%`,
      labelAi: this.formatLabel(responsePredictModel.label),
      tips: responsePredictModel.tips_daur_ulang,
      latency: responsePredictModel.latency_ms,
    };
  };

  scanUserWithOutDailyTask = async ({ user, file }: ProcessScanHistoryType) => {
    try {
      logger.info(`${this.serviceName}: processing scan`);

      const { responsePredictModel, uploadedFileUrl } =
        await this.processScanAndUpload(0, file);

      const { aiResult, category, scanHistory } = await handleTransaction(
        async (tx) => {
          const wasteCategory = await this.getWasteCategory(
            responsePredictModel.label,
          );

          const scanHistory = await this.createScanHistory(
            {
              userId: user.id,
              categoryId: wasteCategory.id,
              confidenceScore: responsePredictModel.confidence,
              imageUrl: uploadedFileUrl,
              pointEarned: 0,
              rawPredictions: responsePredictModel.all_scores,
              scannedAt: new Date(),
            },
            tx,
          );

          return {
            scanHistory,
            category: {
              categoryCode: wasteCategory.categoryCode,
              handlingTips: wasteCategory.handlingTips,
            },
            aiResult: this.buildAiResult(responsePredictModel),
          };
        },
      );

      await Promise.all([
        this.cache.del(cacheKey.scanHistory(user.id)),
        this.cache.del(cacheKey.userSession(user.id)),
        this.cache.del(cacheKey.dashboardStats()),
      ]);

      logger.info(`${this.serviceName}: scan history created successfully`);

      return {
        aiResult,
        category,
        scanHistory,
      };
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, this.serviceName);
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

          const wasteCategory = await this.getWasteCategory(
            responsePredictModel.label,
          );

          const scanHistory = await this.createScanHistory(
            {
              userId: user.id,
              categoryId: wasteCategory.id,
              confidenceScore: responsePredictModel.confidence,
              imageUrl: uploadedFileUrl,
              pointEarned: wasteCategory.pointsReward,
              rawPredictions: responsePredictModel.all_scores,
              scannedAt: new Date(),
            },
            tx,
          );

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
              handlingTips: wasteCategory.handlingTips,
            },
            aiResult: this.buildAiResult(responsePredictModel),
          };
        });

      await Promise.all([
        this.cache.del(cacheKey.scanHistory(user.id)),
        this.cache.del(cacheKey.userSession(user.id)),
        this.cache.del(cacheKey.dashboardStats()),
      ]);

      logger.info(`${this.serviceName}: scan history created successfully`);

      return {
        scanHistory,
        tokenUserRemaining,
        category,
        aiResult,
      };
    } catch (error) {
      throw ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
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
      throw ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
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
      throw ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };
}
