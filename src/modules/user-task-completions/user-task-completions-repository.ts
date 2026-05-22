import { prisma } from '../../infrastructure/database/prisma-client.ts';
import type { TransactionClient } from '../../types/transaction-type.ts';
import type {
  isCompletedUserTaskType,
  UserTaskCompletionType,
} from './user-task-completions-type.ts';

export default class UserTaskCompletionsRepository {
  createUserTaskCompletions = async (
    {
      userId,
      taskId,
      taskDate,
      isCompleted,
      pointAwarded,
    }: UserTaskCompletionType,
    tx?: TransactionClient,
  ) => {
    const db = tx ?? prisma;
    return await db.userTaskCompletions.create({
      data: {
        userId,
        taskId,
        taskDate,
        isCompleted,
        pointAwarded,
      },
    });
  };

  getUserTaskCompletionIsCompleted = async ({
    taskId,
    userId,
  }: isCompletedUserTaskType) => {
    return await prisma.userTaskCompletions.findFirst({
      where: {
        userId,
        taskId,
        isCompleted: true,
      },
      select: {
        isCompleted: true,
      },
    });
  };
}
