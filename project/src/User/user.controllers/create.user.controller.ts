/* eslint-disable prettier/prettier */
import { Post, Body, Controller } from "@nestjs/common";
import { CreateUserService } from "../user.service/create.user.service";
import type { CreateUserDto } from "../user.dtos/create.user.dtos";

@Controller('user')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('create')
  async create(@Body() data: CreateUserDto) {
    return this.createUserService.create(data);
  }
}
