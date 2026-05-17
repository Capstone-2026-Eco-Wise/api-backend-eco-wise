import { prisma } from '../../infrastructure/database/prisma-client.ts';

export default class StatisticsRepository {
  getDashboardStatistics = async () => {
    const [
      totalUsers,
      totalAdmins,
      totalScans,
      totalPointsAggregate,
      totalFaqs,
      totalDailyTasks,
      totalWasteCategories,
    ] = await Promise.all([
      prisma.users.count({ where: { role: 'user' } }),
      prisma.users.count({ where: { role: 'admin' } }),
      prisma.scanHistory.count(),
      prisma.ecoPoints.aggregate({ _sum: { totalPoints: true } }),
      prisma.faqs.count(),
      prisma.dailyTasks.count(),
      prisma.wasteCategories.count(),
    ]);

    return {
      totalUsers,
      totalAdmins,
      totalScans,
      totalPoints: totalPointsAggregate._sum.totalPoints || 0,
      totalFaqs,
      totalDailyTasks,
      totalWasteCategories,
    };
  };
}
