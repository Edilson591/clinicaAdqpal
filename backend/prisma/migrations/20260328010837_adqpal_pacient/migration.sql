/*
  Warnings:

  - Added the required column `agreement` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "medico" TEXT;

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "agreement" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT;
