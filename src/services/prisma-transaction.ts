// /* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../infrastructure/database/prisma-client.ts';
import type { TransactionClient } from '../types/transaction-type.ts';

export const handleTransaction = async <T>(
  callback: (tx: TransactionClient) => Promise<T>,
): Promise<T> => {
  return await prisma.$transaction(callback);
};
