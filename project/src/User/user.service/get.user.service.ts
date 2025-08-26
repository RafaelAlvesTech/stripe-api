/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService} from '../../middlewares/prisma.service';
import {findEmailUser} from '../user.dtos/find.email.user'


@Injectable()

export class GetUserService {
    constructor(private prismaService: PrismaService){}
    async Get(data : findEmailUser){
        const User = await this.prismaService.user.findFirst({
            where : {
                email : data.email
            }
        })

        try{
            if(data){
                return  User
            }
        }
        catch(error){
            throw new Error(error)
        }
    }
}
