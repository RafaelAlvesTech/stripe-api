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

// A inicialização do Stripe está correta.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any }); // Usei uma versão LTS mais recente

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
    
    // NOVO: Validação para garantir que os campos obrigatórios para boleto existem
    if (!data.cpf_cnpj || !data.postal_code || !data.street || !data.city || !data.state) {
        throw new BadRequestException('CPF/CNPJ e endereço completo são obrigatórios para o cadastro.');
    }

    try {
      // ALTERADO: Cria cliente no Stripe com todos os dados necessários para boletos
      const stripeCustomer = await stripe.customers.create({
        name: data.name,
        email: data.email,
        phone: data.phone, // Adicionado telefone
        address: {
          line1: data.street,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: 'BR', // Fixo para o Brasil
        },
        tax_id_data: [
          {
            // Lógica para definir se é CPF ou CNPJ baseado no tamanho
            type: data.cpf_cnpj.length === 11 ? 'br_cpf' : 'br_cnpj',
            value: data.cpf_cnpj,
          },
        ],
      });

      // Hash da senha (sem alterações)
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // ALTERADO: Cria usuário no banco salvando TODOS os novos campos
      const newUser = await this.prismaService.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          stripeCustomerId: stripeCustomer.id,
          // Adicionando os novos campos ao banco de dados
          cpf_cnpj: data.cpf_cnpj,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
        },
      });

      return newUser;
    } catch (error) {
      // Se o erro vier da API do Stripe, ele será capturado aqui
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Erro no gateway de pagamento: ${error.message}`);
      }
      throw new BadRequestException(error instanceof Error ? error.message : String(error));
    }
  }
}