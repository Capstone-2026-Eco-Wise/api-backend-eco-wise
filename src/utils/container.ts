import CacheService from '../infrastructure/cache/cache-service.ts';
import EcoPointsRepository from '../modules/eco-points/eco-points-repository.ts';
import EcoPointsService from '../modules/eco-points/eco-points-service.ts';
import UserRepository from '../modules/users/user-repository.ts';
import UserService from '../modules/users/user-service.ts';
import WasteCategoriesRepository from '../modules/waste-categories/waste-categories-repository.ts';
import WasteCategoriesService from '../modules/waste-categories/waste-categories-service.ts';
import StorageService from '../services/storage-service.ts';

// Init all infrastructure and repository
const cacheService = new CacheService();
const userRepository = new UserRepository();
const ecoPointsRepository = new EcoPointsRepository();
const wasteCategoriesRepository = new WasteCategoriesRepository();
const storageService = new StorageService();

// Init all service
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

export const container = {
  cacheService,
  ecoPointsService,
  userService,
  wasteCategoriesService,
};
