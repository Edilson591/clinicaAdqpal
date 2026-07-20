import type { Patient } from "../../domain/entities/Patient";
import type { PatientResponseDTO } from "../dtos/PatientDTOs";

export function toPatientResponseDTO(patient: Patient): PatientResponseDTO {
  return {
    id: patient.id,
    registrationNumber: patient.registrationNumber,
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    cpf: patient.cpf,
    dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.toISOString() : null,
    street: patient.street,
    streetNumber: patient.streetNumber,
    city: patient.city,
    state: patient.state,
    zipCode: patient.zipCode,
    gender: patient.gender ?? null,
    agreement: patient.agreement ?? null,
    additionalInfo: patient.additionalInfo,
    createdAt: patient.createdAt.toISOString(),
    updatedAt: patient.updatedAt.toISOString(),
  };
}
