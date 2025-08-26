/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserModule } from './User/user.module/user.module';
import {GatewayModule} from './gateway/gateway.module/gateway.module'

@Module({
  imports: [UserModule, GatewayModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
