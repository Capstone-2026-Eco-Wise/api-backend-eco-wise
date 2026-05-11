import z from 'zod';

export const queryValidation = z.object({
  page: z.coerce.number('Invalid format page').optional().default(1),
  limit: z.coerce.number('Invalid format limit').optional().default(10),
  search: z.string('Invalid format search').optional().default(''),
  sort: z.string('Invalid format sort').optional().default('createdAt'),
  order: z
    .enum(['asc', 'desc'], 'Invalid format order')
    .optional()
    .default('desc'),
});
