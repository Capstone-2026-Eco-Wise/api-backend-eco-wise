import z from 'zod';

export const createWasteCategorySchema = z.object({
  categoryCode: z
    .string('Category code must be a string')
    .min(2, 'Category code must be at least 2 characters'),
  categoryName: z
    .string('Category name must be a string')
    .min(2, 'Category name must be at least 3 characters'),
  description: z
    .string('Description must be a string')
    .min(3, 'Description must be at least 3 characters')
    .optional(),
  handlingTips: z
    .string('Handling tips must be a string')
    .min(3, 'Handling tips must be at least 3 characters')
    .optional(),
  colorHex: z
    .string('Color hex must be a string')
    .min(7, 'Color hex must be at least 7 characters')
    .optional(),
  pointsReward: z
    .number('Points reward must be a number')
    .positive('Points reward must be a positive number'),
});

export const updateWasteCategorySchema = createWasteCategorySchema
  .omit({
    categoryCode: true,
  })
  .extend({
    id: z.string('Id must be a string').min(1, 'Id is required'),
  })
  .partial();
