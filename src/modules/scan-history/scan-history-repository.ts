import type { Prisma } from '../../../generated/prisma/client.ts';
import { prisma } from '../../infrastructure/database/prisma-client.ts';
import type { CreateScanHistoryType } from '../../types/scan-history-type.ts';

export default class ScanHistoryRepository {
  createScan = async ({
    userId,
    imageUrl,
    confidenceScore,
    pointEarned,
    categoryId,
    rawPredictions,
    scannedAt,
  }: CreateScanHistoryType) => {
    return await prisma.scanHistory.create({
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
}
