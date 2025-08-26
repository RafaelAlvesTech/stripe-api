/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import {TransactionController} from '../gateway.controllers/gateway.controller';
import {TransactionCreateService} from '../gateway.service/create.gateway'
import {PrismaService} from '../../middlewares/prisma.service'

@Module({
  providers: [TransactionCreateService, PrismaService],
  controllers: [TransactionController],
})
export class GatewayModule {}
