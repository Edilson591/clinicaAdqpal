/*
  Warnings:

  - You are about to drop the column `address` on the `patients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "address",
ADD COLUMN     "additional_info" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "street_number" TEXT,
ADD COLUMN     "zip_code" TEXT;
