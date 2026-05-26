export const cacheKey = {
  userSession: (key: string) => `user-session:${key}`,
  wasteCategories: (key?: string) =>
    key ? `waste-categories:all:${key}` : 'waste-categories:all',
  ecoPoints: (key: string) => `eco-points:user:${key}`,
  scanHistory: (key: string) => `scan-history:user:${key}`,
  faqsPublic: () => `faqs:public`,
  faqsByCreator: (key: string) => `faqs:creator:${key}`,
  dashboardStats: (key?: string) =>
    key ? `dashboard:stats:${key}` : `dashboard:stats`,
};
