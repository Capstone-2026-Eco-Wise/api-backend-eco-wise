import type { Prisma } from '../../../generated/prisma/client.ts';

type PayloadFaqType = {
  id: string;
  question: string;
  answer: string;
  category: string;
  orderNumber: number;
  isActive: boolean;
  createdBy: string | null;
  updatedBy?: string | null;
};

export type CreateFaqType = Omit<PayloadFaqType, 'id'>;

export type UpdateFaqType = Partial<Omit<PayloadFaqType, 'id'>> & {
  id: string;
};

export type DeleteFaqType = Pick<PayloadFaqType, 'id'> & {
  createdBy?: string;
};

export type GetFaqByCreatorType = Pick<PayloadFaqType, 'createdBy'>;

export type FilterFaqType = {
  whereOption?: Prisma.faqsWhereInput;
  selectOption?: Prisma.faqsSelect;
  orderByOption?: Prisma.faqsOrderByWithAggregationInput[];
};

export type CheckIsOwnerType = Pick<PayloadFaqType, 'id' | 'createdBy'>;

export type QueryFaqType = Pick<Partial<PayloadFaqType>, 'category'>;
