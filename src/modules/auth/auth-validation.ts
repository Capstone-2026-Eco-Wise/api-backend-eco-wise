import z from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/\W/, 'Password must contain at least one special character');

export const signUpValidation = z.object({
  email: z.email('Invalid email address').max(255, 'Email too long'),
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: passwordSchema,
});

export const signInValidation = z.object({
  email: z.email('Invalid email address'),
  password: passwordSchema,
});

export const updatePasswordValidation = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
});
