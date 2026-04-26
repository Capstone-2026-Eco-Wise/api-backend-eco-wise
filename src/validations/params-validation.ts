import z from 'zod';

export const paramsValidation = (id?: string, slug?: string) => {
  return z.object({
    ...(id && {
      [id]: z.uuid({
        message: `${id} must be a valid UUID`,
      }),
    }),
    ...(slug && {
      [slug]: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: `${slug} must be a valid slug`,
      }),
    }),
  });
};
