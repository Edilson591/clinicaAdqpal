/*
  Warnings:

  - A unique constraint covering the columns `[registration_number]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registration_number` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "registration_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "patients_registration_number_key" ON "patients"("registration_number");
