/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// user.module.ts
import { Module } from '@nestjs/common';
import { CreateUserController } from '../user.controllers/create.user.controller';
import { CreateUserService } from '../user.service/create.user.service';
import { PrismaService} from '../../middlewares/prisma.service'

@Module({
  providers: [CreateUserService, PrismaService],
  controllers: [CreateUserController],
})
export class UserModule {}
