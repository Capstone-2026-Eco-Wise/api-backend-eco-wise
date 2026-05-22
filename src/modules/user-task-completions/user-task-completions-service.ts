import type { Users } from '../../../generated/prisma/client.ts';
import { ErrorFactory } from '../../errors/error-factory.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import { handleTransaction } from '../../services/prisma-transaction.ts';
import type DailyTasksRepository from '../daily-tasks/daily-tasks-repository.ts';
import type EcoPointsService from '../eco-points/eco-points-service.ts';
import type ScanHistoryService from '../scan-history/scan-history-service.ts';
import type UserTaskCompletionsRepository from './user-task-completions-repository.ts';

export default class UserTaskCompletionsService {
  private userTaskCompletionsRepository: UserTaskCompletionsRepository;
  private scanHistoryService: ScanHistoryService;
  private dailyTaskRepository: DailyTasksRepository;
  private ecoPointsService: EcoPointsService;
  private serviceName: string;

  constructor(
    userTaskCompletionsRepository: UserTaskCompletionsRepository,
    scanHistoryService: ScanHistoryService,
    dailyTaskRepository: DailyTasksRepository,
    ecoPointsService: EcoPointsService,
  ) {
    this.userTaskCompletionsRepository = userTaskCompletionsRepository;
    this.scanHistoryService = scanHistoryService;
    this.dailyTaskRepository = dailyTaskRepository;
    this.ecoPointsService = ecoPointsService;
    this.serviceName = '[User Task Completions]';
  }

  userCompletedTask = async (
    user: Users,
    file: Express.Multer.File,
    taskId: string,
  ) => {
    try {
      logger.info(
        `${this.serviceName}: Processing new user task completion for userId: ${user.id}`,
      );

      // ── Guard checks ─────────────────────────────────────────────────────
      const isCompletedUserTask =
        await this.userTaskCompletionsRepository.getUserTaskCompletionIsCompleted(
          { userId: user.id, taskId },
        );

      if (isCompletedUserTask?.isCompleted === true) {
        throw ErrorFactory.clientError('You have already completed this task.');
      }

      const dailyTask = await this.dailyTaskRepository.getTaskById({
        id: taskId,
      });

      const today = new Date();
      const isMatchDate =
        today.toDateString() === dailyTask?.activeDate.toDateString();

      if (!dailyTask?.isActive || !isMatchDate) {
        logger.warn(
          `${this.serviceName}: Daily task not found or ${dailyTask?.isActive}, today: ${today.toDateString()}, activeDate: ${dailyTask?.activeDate.toDateString()}`,
        );

        throw ErrorFactory.clientError(
          'Daily task not found or not active',
          404,
        );
      }

      // ── PHASE 1: External calls (AI + Storage) — tidak bisa di-rollback ──
      // processScanImage melakukan: upload gambar, call AI, simpan scanHistory,
      // dan deduct token user. Ini dilakukan terlebih dahulu sebelum transaksi DB.
      const { scanHistory, aiResult, tokenUserRemaining } =
        await this.scanHistoryService.processScanImage({
          user,
          file,
        });

      // ── Hitung point berdasarkan kecocokan kategori ───────────────────────
      const isTaskMatch = scanHistory.categoryId === dailyTask.categoryId;
      const pointAwarded = isTaskMatch
        ? scanHistory.pointEarned + dailyTask.pointReward
        : 0;

      // ── PHASE 2: Atomik DB — update ecoPoints + create taskCompletion ─────
      // Gunakan $transaction dengan callback agar kedua operasi atomik.
      // Jika salah satu gagal, keduanya rollback.
      const { ecoPointsUpdated, completedTask } = await handleTransaction(
        async (tx) => {
          // Update streak + total points
          const ecoPointsUpdated =
            await this.ecoPointsService.updatePointsUserWithTx(
              { userId: user.id, pointUpdate: pointAwarded },
              tx,
            );

          if (!ecoPointsUpdated) {
            throw ErrorFactory.clientError('Failed to update eco points');
          }

          // Catat task completion
          const completedTask =
            await this.userTaskCompletionsRepository.createUserTaskCompletions(
              {
                userId: scanHistory.userId,
                taskId: dailyTask.id,
                taskDate: scanHistory.scannedAt,
                pointAwarded,
                isCompleted: isTaskMatch,
              },
              tx,
            );

          return { ecoPointsUpdated, completedTask };
        },
      );

      logger.info(
        `${this.serviceName}: Task completion processed for userId: ${user.id}`,
      );

      return {
        scanHistory,
        aiResult,
        tokenUserRemaining,
        ecoPoints: ecoPointsUpdated,
        completedTask,
      };
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };
}
