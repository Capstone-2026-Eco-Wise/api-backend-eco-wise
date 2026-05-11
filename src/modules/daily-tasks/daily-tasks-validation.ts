import z from 'zod';
import { uuidValidation } from '../../validations/uuid-validation.ts';
import { queryValidation } from '../../validations/query-validation.ts';

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

export const updateDailyTasksValidation = createDailyTasksValidation.partial();

export const queryDailyTasksValidation = queryValidation.extend({
  category: uuidValidation.optional().nullable(),
  active: z
    .enum(['true', 'false'], { error: 'Invalid format active' })
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});
