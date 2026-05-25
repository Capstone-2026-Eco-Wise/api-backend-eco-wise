import type { users } from '../../generated/prisma/client.ts';
import { container } from './container.ts';

export const checkAndResetUserTokens = async (user: users) => {
  if (!user || !user.tokenResetAt) return user;

  const now = new Date();
  const resetAt = new Date(user.tokenResetAt);

  if (now >= resetAt) {
    const nextReset = new Date();
    nextReset.setHours(24, 0, 0, 0); 

    const updatedUser = await container.userService.resetTokenUser({
      id: user.id,
      nextReset,
    });

    return updatedUser;
  }

  return user;
};
