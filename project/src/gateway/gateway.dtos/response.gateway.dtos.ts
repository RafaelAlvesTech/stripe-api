/* eslint-disable prettier/prettier */
import { TransactionStatus } from 'generated/prisma/client';

export interface TransactionResponseDto {
  id: string;
  userId: string;
  amount: number; // ou string se usar Decimal
  currency: string;
  status: TransactionStatus;
  stripePaymentId?: string;
  description?: string;
  createdAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    stripeCustomerId?: string;
  };
}