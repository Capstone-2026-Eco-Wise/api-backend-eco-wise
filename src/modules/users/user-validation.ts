import z from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/\W/, 'Password must contain at least one special character');

export const userSignUpValidation = z.object({
  full_name: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.email('Invalid email address').max(255, 'Email too long'),
  password: passwordSchema,
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

export const userSignInValidation = z.object({
  email: z.email('Invalid email address'),
  password: passwordSchema,
});
