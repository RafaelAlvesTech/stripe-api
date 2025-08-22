/* eslint-disable prettier/prettier */
import {TransactionResponseDto} from '../../gateway/gateway.dtos/response.gateway.dtos'
export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
  transactions?: TransactionResponseDto[];
}