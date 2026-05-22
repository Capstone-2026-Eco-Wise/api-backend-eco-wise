type PayloadEcoPointsType = {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
};

export type CreateEcoPointsTypes = PayloadEcoPointsType & {
  totalPoints: number;
};

export type UpdateTotalPointsType = PayloadEcoPointsType & {
  newPoints: number;
};

export type PayloadUpdateTotalPointsType = Omit<
  PayloadEcoPointsType,
  'currentStreak' | 'longestStreak' | 'lastActiveDate'
> & {
  pointUpdate: number;
};

export type FilterLeaderboardType = {
  type: 'streak' | 'point';
};
