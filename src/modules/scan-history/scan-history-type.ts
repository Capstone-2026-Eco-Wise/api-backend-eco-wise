import type { Users } from '../../../generated/prisma/client.ts';

export type ProcessScanHistoryType = {
  user: Users;
  file: Express.Multer.File;
};

export type CreateScanHistoryType = {
  userId: string;
  imageUrl: string;
  confidenceScore: number;
  pointEarned: number;
  categoryId: string;
  rawPredictions: string;
  scannedAt: Date;
};

export type ResponsePredictFromAiType = {
  label: string;
  confidence: number;
  all_scores: string;
  tips_daur_ulang: string;
  filename: string;
  latency_ms: number;
};
