import z from 'zod';

export const queryValidation = z.object({
  page: z
    .string()
    .regex(/^\d+$/, { message: 'Page must be a valid positive number' })
    .optional()
    .transform((val) => (val ? Number(val) : 1)),
  limit: z
    .string()
    .regex(/^\d+$/, { message: 'Limit must be a valid positive number' })
    .optional()
    .transform((val) => (val ? Number(val) : 10)),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
