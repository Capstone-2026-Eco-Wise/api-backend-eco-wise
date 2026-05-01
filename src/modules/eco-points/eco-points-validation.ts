import z from 'zod';

export const updatePointSchema = z.object({
  pointUpdate: z
    .number()
    .int('Point update must be an integer')
    .nonnegative('Point update must be a positive integer'),
});
