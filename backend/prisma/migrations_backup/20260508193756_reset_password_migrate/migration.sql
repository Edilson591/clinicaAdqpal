/*
  Warnings:

  - A unique constraint covering the columns `[resetCodeExpires]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_cpf_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetCode" TEXT,
ADD COLUMN     "resetCodeExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "users_resetCodeExpires_key" ON "users"("resetCodeExpires");
