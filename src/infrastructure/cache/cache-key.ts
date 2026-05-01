export const cacheKey = {
  userSession: (key: string) => `user-session:${key}`,
  wasteCategories: (key?: string) =>
    key ? `waste-categories:all:${key}` : 'waste-categories:all',
  ecoPoints: (key: string) => `eco-points:user:${key}`,
};
