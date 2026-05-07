import CacheService from '../infrastructure/cache/cache-service.ts';
import EcoPointsRepository from '../modules/eco-points/eco-points-repository.ts';
import EcoPointsService from '../modules/eco-points/eco-points-service.ts';
import ScanHistoryRepository from '../modules/scan-history/scan-history-repository.ts';
import ScanHistoryService from '../modules/scan-history/scan-history-service.ts';
import UserRepository from '../modules/users/user-repository.ts';
import UserService from '../modules/users/user-service.ts';
import WasteCategoriesRepository from '../modules/waste-categories/waste-categories-repository.ts';
import WasteCategoriesService from '../modules/waste-categories/waste-categories-service.ts';
import AiService from '../services/ai-service.ts';
import StorageService from '../services/storage-service.ts';

// Init all infrastructure and repository
const userRepository = new UserRepository();
const wasteCategoriesRepository = new WasteCategoriesRepository();
const ecoPointsRepository = new EcoPointsRepository();
const scanHistoryRepository = new ScanHistoryRepository();

// Init all service
const cacheService = new CacheService();
const storageService = new StorageService();
const aiService = new AiService();

const ecoPointsService = new EcoPointsService(
  ecoPointsRepository,
  cacheService,
);
const userService = new UserService(
  userRepository,
  ecoPointsService,
  storageService,
  cacheService,
);
const wasteCategoriesService = new WasteCategoriesService(
  wasteCategoriesRepository,
  cacheService,
);
const scanHistoryService = new ScanHistoryService(
  scanHistoryRepository,
  aiService,
  storageService,
  wasteCategoriesRepository,
  cacheService,
);

export const container = {
  cacheService,
  ecoPointsService,
  userService,
  wasteCategoriesService,
  scanHistoryService,
};
