export type UserTaskCompletionType = {
  userId: string;
  taskId: string;
  taskDate: Date;
  pointAwarded: number;
  isCompleted: boolean;
};

export type isCompletedUserTaskType = Pick<
  UserTaskCompletionType,
  'userId' | 'taskId'
>;
