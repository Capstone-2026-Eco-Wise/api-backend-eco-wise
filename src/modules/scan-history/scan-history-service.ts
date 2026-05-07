import type { Users } from '../../../generated/prisma/client.ts';
import { ErrorFactory } from '../../errors/error-factory.ts';
import { cacheKey } from '../../infrastructure/cache/cache-key.ts';
import type CacheService from '../../infrastructure/cache/cache-service.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type AiService from '../../services/ai-service.ts';
import type StorageService from '../../services/storage-service.ts';
import { storageConfig } from '../../services/storage-service.ts';
import type WasteCategoriesRepository from '../waste-categories/waste-categories-repository.ts';
import type ScanHistoryRepository from './scan-history-repository.ts';

export default class ScanHistoryService {
  private scanHistoryRepository: ScanHistoryRepository;
  private aiService: AiService;
  private storageService: StorageService;
  private wasteCategoriesRepository: WasteCategoriesRepository;
  private cache: CacheService;
  private serviceName: string;

  constructor(
    scanHistoryRepository: ScanHistoryRepository,
    aiService: AiService,
    storageService: StorageService,
    wasteCategoriesRepository: WasteCategoriesRepository,
    cache: CacheService,
  ) {
    this.scanHistoryRepository = scanHistoryRepository;
    this.aiService = aiService;
    this.storageService = storageService;
    this.wasteCategoriesRepository = wasteCategoriesRepository;
    this.cache = cache;
    this.serviceName = '[Scan History Service]';
  }

  processUserScan = async (user: Users, file: Express.Multer.File) => {
    let uploadedFileUrl: string | undefined;

    try {
      logger.info(`${this.serviceName} processing user scan`);

      const [uploadResult, { data: aiResponse }] = await Promise.all([
        this.storageService.uploadImageToSupabase(
          file,
          storageConfig.bucketName,
          storageConfig.scannedMedia,
        ),
        this.aiService.classifyImage(file),
      ]);

      uploadedFileUrl = uploadResult.publicUrl;

      const wasteCategory =
        await this.wasteCategoriesRepository.getCategoriesByCode(
          aiResponse.prediction.toUpperCase(),
        );

      if (!wasteCategory?.id) {
        throw ErrorFactory.clientError(
          `Category '${aiResponse.prediction}' not found`,
          404,
        );
      }

      const scanData = {
        userId: user.id,
        categoryId: wasteCategory.id,
        imageUrl: uploadedFileUrl,
        confidenceScore: aiResponse.confidence,
        rawPredictions: aiResponse.all_probabilities,
        pointEarned: wasteCategory.pointsReward || 0,
        scannedAt: new Date(),
      };

      const scanHistory = await this.scanHistoryRepository.createScan(scanData);

      await this.cache.del(cacheKey.scanHistory(user.id));

      logger.info(`${this.serviceName}: scan history created successfully`);

      return { scanHistory, message: aiResponse.message };
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

      ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };

  getScanHistoryUser = async (user: Users) => {
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
      ErrorFactory.handlerServiceError(error, `${this.serviceName}`);
    }
  };
}
