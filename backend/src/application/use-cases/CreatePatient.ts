import type { IPatientRepository } from "../../domain/repositories/IPatientRepository";
import type { CreatePatientDTO, PatientResponseDTO } from "../dtos/PatientDTOs";
import { ConflictError } from "../../domain/errors/DomainError";
import { toPatientResponseDTO } from "../mappers/patientMapper";

export class CreatePatient {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(dto: CreatePatientDTO): Promise<PatientResponseDTO> {
    if (dto.cpf) {
      const existing = await this.patientRepository.findByCpf(dto.cpf);
      if (existing) throw new ConflictError("Já existe um paciente com este CPF.");
    }

    const patient = await this.patientRepository.create({
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      cpf: dto.cpf ?? null,
      dateOfBirth: dto.dateOfBirth ?? null,
      agreement: dto.agreement ?? null,
      additionalInfo: dto.additionalInfo ?? null,
      city: dto.city ?? null,
      state: dto.state ?? null,
      street: dto.street ?? null,
      streetNumber: dto.streetNumber ?? null,
      zipCode: dto.zipCode ?? null,
      gender: dto.gender ?? null,
    });

    return toPatientResponseDTO(patient);
  }
}
