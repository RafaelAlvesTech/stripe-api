/* eslint-disable prettier/prettier */
import { TransactionStatus } from "generated/prisma/client";
export interface UpdateTransactionDto {
  amount?: number;
  currency?: string;
  status?: TransactionStatus;
  stripePaymentId?: string;
  description?: string;
}