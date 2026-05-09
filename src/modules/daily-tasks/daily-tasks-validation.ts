import z from 'zod';
import { uuidValidation } from '../../validations/uuid-validation.ts';

const activeDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
  .transform((value) => new Date(value))
  .refine((date) => !isNaN(date.getTime()), 'Invalid format active date');

const payloadDailyTasksValidation = z.object({
  categoryId: uuidValidation.optional(),
  taskName: z
    .string('Invalid format task name')
    .min(1, 'Task name cannot be empty'),
  description: z.string('Invalid format description').optional(),
  pointReward: z.number('Invalid format point reward'),
  isActive: z.boolean('Invalid format is active'),
  activeDate: activeDateSchema,
});

export const createDailyTasksValidation = payloadDailyTasksValidation;

export const queryDailyTasksValidation = z.object({
  category: uuidValidation.optional().nullable(),
  active: z
    .enum(['true', 'false'], { error: 'Invalid format active' })
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
  search: z.string('Invalid format search').optional().default(''),
  limit: z.coerce.number('Invalid format limit').optional().default(10),
  page: z.coerce.number('Invalid format page').optional().default(1),
  sort: z.string('Invalid format sort').optional().default('createdAt'),
  order: z
    .enum(['asc', 'desc'], 'Invalid format order')
    .optional()
    .default('desc'),
});

export const updateDailyTasksValidation = createDailyTasksValidation.partial();
