/* eslint-disable prettier/prettier */
import { TransactionStatus } from "generated/prisma/client";

export interface CreateTransactionDto {
  userId: string;
  amount: number; // ou string se quiser lidar com Decimal
  currency?: string;
  status?: TransactionStatus;
  stripePaymentId?: string;
  description?: string;
}