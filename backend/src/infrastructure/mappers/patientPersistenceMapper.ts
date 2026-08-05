import type { Patient as PrismaPatient } from "@prisma/client";
import type { Patient } from "../../domain/entities/Patient";
import { EncryptionService } from "../services/EncryptionService";

const crypto = new EncryptionService();

export function toPatientDomain(row: PrismaPatient): Patient {
  return {
    id: row.id,
    registrationNumber: row.registration_number,
    name: row.name,
    email: crypto.decrypt(row.email),
    phone: crypto.decrypt(row.phone),
    cpf: crypto.decrypt(row.cpf),
    dateOfBirth: row.dateOfBirth,
    gender: row.gender,
    agreement: crypto.decrypt(row.agreement),
    street: crypto.decrypt(row.street),
    streetNumber: crypto.decrypt(row.streetNumber),
    city: crypto.decrypt(row.city),
    state: crypto.decrypt(row.state),
    zipCode: crypto.decrypt(row.zipCode),
    additionalInfo: crypto.decrypt(row.additionalInfo),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
