/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from "@nestjs/common";
import { GetUserService} from '../user.service/get.user.service'
import { findEmailUser} from '../user.dtos/find.email.user'


@Controller('user')
export class getUserController{
constructor(private readonly getuserservice : GetUserService){}
@Post('get')
async get(@Body() data : findEmailUser){
    return this.getuserservice.Get(data)
}

}
