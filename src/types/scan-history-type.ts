export type ResponsePredictType = {
  all_probabilities: string;
  prediction: string;
  confidence: number;
  message: string;
};

export type ResponseAiType = {
  data: ResponsePredictType;
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
