type PayloadDailyTasksType = {
  categoryId?: string | null;
  taskName: string;
  description?: string | null;
  pointReward: number;
  isActive: boolean;
  activeDate: Date;
};

export type CreateDailyTasksType = PayloadDailyTasksType;

export type QueryDailyTasksType = {
  category: string | null;
  active: boolean;
  search: string;
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
};

export type UpdateDailyTasksType = Partial<PayloadDailyTasksType> & {
  id: string;
};
