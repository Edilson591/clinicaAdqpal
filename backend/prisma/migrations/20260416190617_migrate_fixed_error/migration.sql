-- DropForeignKey
ALTER TABLE "medical_records" DROP CONSTRAINT "medical_records_appointment_id_fkey";

-- AlterTable
ALTER TABLE "medical_records" ALTER COLUMN "appointment_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
