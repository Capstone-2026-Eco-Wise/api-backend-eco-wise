export type CreateWasteCategoriesType = {
  categoryCode: string;
  categoryName: string;
  description: string;
  handlingTips: string;
  colorHex: string;
  pointsReward: number;
};

export type UpdateWasteCategoriesType = {
  id: string;
} & Omit<CreateWasteCategoriesType, 'categoryCode'>;
