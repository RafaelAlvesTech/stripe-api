/*
  Warnings:

  - A unique constraint covering the columns `[stripePaymentId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf_cnpj]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "boletoLine" TEXT,
ADD COLUMN     "boletoUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "cpf_cnpj" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "postal_code" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_stripePaymentId_key" ON "public"."Transaction"("stripePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_cnpj_key" ON "public"."User"("cpf_cnpj");
