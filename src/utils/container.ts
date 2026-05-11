import CacheService from '../infrastructure/cache/cache-service.ts';
import AuthRepository from '../modules/auth/auth-repository.ts';
import AuthService from '../modules/auth/auth-service.ts';
import DailyTasksRepository from '../modules/daily-tasks/daily-tasks-repository.ts';
import DailyTasksService from '../modules/daily-tasks/daily-tasks-service.ts';
import EcoPointsRepository from '../modules/eco-points/eco-points-repository.ts';
import EcoPointsService from '../modules/eco-points/eco-points-service.ts';
import FaqsRepository from '../modules/faqs/faqs-repository.ts';
import FaqsService from '../modules/faqs/faqs-service.ts';
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
const authRepository = new AuthRepository();
const faqsRepository = new FaqsRepository();
const wasteCategoriesRepository = new WasteCategoriesRepository();
const ecoPointsRepository = new EcoPointsRepository();
const scanHistoryRepository = new ScanHistoryRepository();
const dailyTasksRepository = new DailyTasksRepository();

const cacheService = new CacheService();
const storageService = new StorageService();
const aiService = new AiService();
const ecoPointsService = new EcoPointsService(
  ecoPointsRepository,
  cacheService,
);
const userService = new UserService(
  userRepository,
  storageService,
  cacheService,
);
const authService = new AuthService(
  authRepository,
  ecoPointsService,
  cacheService,
);
const faqsService = new FaqsService(faqsRepository, cacheService);
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
const dailyTasksService = new DailyTasksService(dailyTasksRepository);

export const container = {
  cacheService,
  userService,
  authService,
  faqsService,
  ecoPointsService,
  wasteCategoriesService,
  scanHistoryService,
  dailyTasksService,
};
