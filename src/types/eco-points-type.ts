export type CreateEcoPointsTypes = {
  userId: string;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
};

export type UpdateTotalPointsType = {
  userId: string;
  newPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
};

export type PayloadUpdateTotalPointsType = {
  userId: string;
  pointUpdate: number;
};
