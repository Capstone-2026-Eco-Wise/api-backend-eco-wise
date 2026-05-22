import type { Prisma } from '../../../generated/prisma/client.ts';
import { prisma } from '../../infrastructure/database/prisma-client.ts';
import type { TransactionClient } from '../../types/transaction-type.ts';
import type { CreateScanHistoryType } from './scan-history-type.ts';

export default class ScanHistoryRepository {
  createScan = async (
    {
      userId,
      imageUrl,
      confidenceScore,
      pointEarned,
      categoryId,
      rawPredictions,
      scannedAt,
    }: CreateScanHistoryType,
    tx?: TransactionClient,
  ) => {
    const db = tx ?? prisma;
    return await db.scanHistory.create({
      data: {
        userId,
        categoryId,
        imageUrl,
        rawPredictions,
        confidenceScore,
        pointEarned,
        scannedAt,
      },
    });
  };

  getHistoryScan = async (
    userId: string,
    option?: Prisma.scanHistoryFindManyArgs,
  ) => {
    return await prisma.scanHistory.findMany({
      where: {
        userId,
      },
      ...option,
    });
  };

  getHistoryScanById = async (id: string, userId: string) => {
    return await prisma.scanHistory.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        category: {
          select: {
            categoryCode: true,
            categoryName: true,
            description: true,
            colorHex: true,
            handlingTips: true,
            pointsReward: true,
          },
        },
      },
    });
  };
}
