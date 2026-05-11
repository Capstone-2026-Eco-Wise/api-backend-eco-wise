import z from 'zod';
import { queryValidation } from '../../validations/query-validation.ts';

export const createFAQValidation = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().min(1, 'Category is required'),
  orderNumber: z.number().min(1, 'Order number is required').default(0),
  isActive: z.boolean().default(false),
});

export const updateFAQValidation = createFAQValidation.partial();

export const queryFAQValidation = queryValidation.extend({
  category: z
    .string()
    .optional()
    .transform((value) => value?.trim()),
});
