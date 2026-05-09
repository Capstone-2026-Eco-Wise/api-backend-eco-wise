import type { QueryDailyTasksType } from '../../modules/daily-tasks/daily-tasks-type';

export const cacheKey = {
  userSession: (key: string) => `user-session:${key}`,
  wasteCategories: (key?: string) =>
    key ? `waste-categories:all:${key}` : 'waste-categories:all',
  ecoPoints: (key: string) => `eco-points:user:${key}`,
  scanHistory: (key: string) => `scan-history:user:${key}`,
  dailyTasks: (key?: any) =>
    `daily-tasks:` +
    `category=${key?.category}:` +
    `active=${key?.active}:` +
    `search=${key?.search}:` +
    `page=${key?.page}:` +
    `limit=${key?.limit}:` +
    `sort=${key?.sort}:` +
    `order=${key?.order}`,
};
