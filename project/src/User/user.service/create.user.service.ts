/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from '../../middlewares/prisma.service';
import { CreateUserDto } from '../user.dtos/create.user.dtos';
import Stripe from 'stripe';
import * as bcrypt from 'bcrypt';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-07-30.basil' as any  });

@Injectable()
export class CreateUserService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateUserDto) {
    const existingUser = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException("Usuário já cadastrado!");
    }

    try {
      // Cria cliente no Stripe
      const stripeCustomer = await stripe.customers.create({
        name: data.name,
        email: data.email,
      });

      // Hash da senha
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Cria usuário no banco
      const newUser = await this.prismaService.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          stripeCustomerId: stripeCustomer.id,
        },
      });

      return newUser;
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : String(error));
    }
  }
}
