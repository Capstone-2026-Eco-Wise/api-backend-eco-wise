import z from 'zod';
import { uuidValidation } from './uuid-validation.ts';

export const paramsValidation = (id?: string, slug?: string) => {
  return z.object({
    ...(id && {
      [id]: uuidValidation,
    }),
    ...(slug && {
      [slug]: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: `${slug} must be a valid slug`,
      }),
    }),
  });
};
