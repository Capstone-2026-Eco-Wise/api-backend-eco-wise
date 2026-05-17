import z from 'zod';
import { ROLE_USER } from '../../../generated/prisma/client.ts';

export const updateProfileUserValidation = z.object({
  fullName: z.string().min(1, 'Full name is required'),
});

export const updateRoleUserValidation = z.object({
  role: z.enum([ROLE_USER.admin, ROLE_USER.user], 'Invalid role'),
});
