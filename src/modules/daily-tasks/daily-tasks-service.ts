import { ErrorFactory } from '../../errors/error-factory.ts';
import { logger } from '../../infrastructure/logger/logger.ts';
import type DailyTasksRepository from './daily-tasks-repository.ts';
import type {
  CreateDailyTasksType,
  IdDailyTasksType,
  QueryDailyTasksType,
  UpdateDailyTasksType,
} from './daily-tasks-type.ts';

export default class DailyTasksService {
  private dailyTasksRepository: DailyTasksRepository;
  private serviceName: string;

  constructor(dailyTasksRepository: DailyTasksRepository) {
    this.dailyTasksRepository = dailyTasksRepository;
    this.serviceName = '[Daily Tasks Service]';
  }

  createMasterTasks = async ({
    categoryId,
    taskName,
    description,
    isActive,
    pointReward,
    activeDate,
  }: CreateDailyTasksType) => {
    try {
      logger.info(`${this.serviceName}: Creating new master tasks`);

      const dailyTasks = await this.dailyTasksRepository.createTask({
        categoryId: categoryId || null,
        taskName,
        description: description || null,
        pointReward,
        isActive,
        activeDate,
      });

      if (!dailyTasks) {
        throw ErrorFactory.clientError('Failed to create master tasks');
      }

      logger.info(
        `${this.serviceName}: Successfully created master tasks with ID: ${dailyTasks.id}`,
      );

      return dailyTasks;
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  getAllDailyTasks = async (queryParams: QueryDailyTasksType) => {
    try {
      logger.info(`${this.serviceName}: Retrieving all daily tasks`);

      const { active, category, limit, order, page, search, sort } =
        queryParams;

      const dailyTasks = await this.dailyTasksRepository.getAllDailyTask({
        active,
        limit,
        page,
        category,
        search,
        sort,
        order,
      });

      if (!dailyTasks.data) {
        logger.error(
          `${this.serviceName}: Failed to retrieve daily tasks`,
          dailyTasks,
        );
        throw ErrorFactory.notFoundError('Daily tasks not found');
      }

      logger.info(
        `${this.serviceName}: Successfully retrieved daily tasks with count: ${dailyTasks.data.length}`,
      );

      return dailyTasks;
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  getDailyTaskById = async ({ id }: IdDailyTasksType) => {
    try {
      logger.info(`${this.serviceName}: Retrieving daily task with ID: ${id}`);

      const dailyTasks = await this.dailyTasksRepository.getTaskById({ id });

      if (!dailyTasks) {
        logger.error(
          `${this.serviceName}: Failed to retrieve daily task`,
          dailyTasks,
        );
        throw ErrorFactory.notFoundError('Daily task not found');
      }

      logger.info(
        `${this.serviceName}: Successfully retrieved daily task with ID: ${dailyTasks.id}`,
      );

      return dailyTasks;
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  updateDailyTasks = async ({
    id,
    categoryId,
    taskName,
    description,
    pointReward,
    isActive,
    activeDate,
  }: UpdateDailyTasksType) => {
    try {
      logger.info(`${this.serviceName}: Updating daily tasks with ID: ${id}`);

      const dailyTasks = await this.dailyTasksRepository.updateTask({
        id,
        ...(categoryId && { categoryId }),
        ...(taskName && { taskName }),
        ...(description && { description }),
        ...(pointReward && { pointReward }),
        ...(isActive !== undefined && { isActive }),
        ...(activeDate && { activeDate }),
      });

      if (!dailyTasks) {
        logger.error(
          `${this.serviceName}: Failed to update daily tasks`,
          dailyTasks,
        );
        throw ErrorFactory.notFoundError('Daily tasks not found');
      }

      logger.info(
        `${this.serviceName}: Successfully updated daily tasks with ID: ${dailyTasks.id}`,
      );

      return dailyTasks;
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };

  deleteDailyTasks = async (id: string) => {
    try {
      logger.info(`${this.serviceName}: Deleting daily tasks with ID: ${id}`);

      const dailyTasks = await this.dailyTasksRepository.deleteTask({ id });

      if (!dailyTasks) {
        logger.error(
          `${this.serviceName}: Failed to delete daily tasks`,
          dailyTasks,
        );
        throw ErrorFactory.notFoundError('Daily tasks not found');
      }

      logger.info(
        `${this.serviceName}: Successfully deleted daily tasks with ID: ${dailyTasks.id}`,
      );

      return dailyTasks;
    } catch (error) {
      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  };
}
