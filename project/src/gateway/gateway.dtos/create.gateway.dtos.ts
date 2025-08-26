/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNumber, Min, IsOptional, IsEnum } from 'class-validator';
import { TransactionStatus } from 'generated/prisma/client';

export class CreateTransactionDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsString()
  stripePaymentId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
