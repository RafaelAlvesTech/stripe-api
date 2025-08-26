/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../middlewares/prisma.service';
import Stripe from 'stripe';
import { CreateTransactionDto } from '../gateway.dtos/create.gateway.dtos';
import { TransactionStatus } from 'generated/prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any
});


@Injectable()
export class TransactionCreateService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateTransactionDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) throw new NotFoundException('Usuário não encontrado');
      if (!user.stripeCustomerId)
        throw new BadRequestException('Usuário não possui um ID de cliente no Stripe');
      if (!user.cpf_cnpj || !user.name || !user.email || !user.street || !user.city || !user.state || !user.postal_code)
        throw new BadRequestException('Dados de cadastro do usuário (nome, e-mail, CPF e endereço) estão incompletos.');

      const amountInCents = Math.round(Number(data.amount) * 100);
      if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
        throw new BadRequestException('O valor da transação é inválido');
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'brl',
        customer: user.stripeCustomerId,
        description: data.description ?? 'Pagamento via boleto',
        receipt_email: user.email,
        payment_method_data: {
          type: 'boleto',
          boleto: {
            tax_id: user.cpf_cnpj,
          },
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
                country: 'BR',
                postal_code: user.postal_code ?? undefined,
                state: user.state ?? undefined,
                city: user.city ?? undefined,
                line1: user.street ?? undefined,
            }
          }
        },
        // --- CORREÇÃO AQUI ---
        // 'confirm' é um parâmetro de alto nível, não fica dentro de 'payment_method_data'
        confirm: true,
        return_url: process.env.FRONTEND_RETURN_URL, 
        // --- FIM DA CORREÇÃO ---
        payment_method_options: {
          boleto: {
            expires_after_days: 3,
          },
        },
      });

      const boletoDetails = paymentIntent.next_action?.boleto_display_details;
      
      if (!boletoDetails) {
        const lastError = paymentIntent.last_payment_error;
        const errorMessage = lastError?.message ?? 'Não foi possível gerar os detalhes do boleto.';
        throw new Error(errorMessage);
      }

      const transaction = await this.prismaService.transaction.create({
        data: {
          userId: user.id,
          amount: Number(data.amount),
          currency: 'BRL',
          status: TransactionStatus.PENDING,
          stripePaymentId: paymentIntent.id,
          description: data.description ?? 'Pagamento via boleto',
          boletoUrl: boletoDetails.pdf,
          boletoLine: boletoDetails.number,
        },
      });

      return {
        transactionId: transaction.id,
        status: transaction.status,
        boletoUrl: boletoDetails.pdf,
        boletoNumber: boletoDetails.number,
        boletoExpiresAt: boletoDetails.expires_at,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Erro no gateway de pagamento: ${error.message}`);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}