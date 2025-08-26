/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { TransactionCreateService} from '../gateway.service/create.gateway';
import { CreateTransactionDto } from '../gateway.dtos/create.gateway.dtos';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionCreateService) {}

  @Post('pix')
  async createPixPayment(@Body() data: CreateTransactionDto) {
    return this.transactionService.create(data);
  }
}
