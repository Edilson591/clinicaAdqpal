import type { IPatientRepository } from "../../domain/repositories/IPatientRepository";
import type { UpdatePatientDTO, PatientResponseDTO } from "../dtos/PatientDTOs";
import { NotFoundError, ConflictError } from "../../domain/errors/DomainError";
import { toPatientResponseDTO } from "../mappers/patientMapper";

export class UpdatePatient {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(id: string, dto: UpdatePatientDTO): Promise<PatientResponseDTO> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) throw new NotFoundError("Paciente");

    if (dto.cpf && dto.cpf !== patient.cpf) {
      const existing = await this.patientRepository.findByCpf(dto.cpf);
      if (existing) throw new ConflictError("CPF já pertence a outro paciente.");
    }

    const updated = await this.patientRepository.update(id, {
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
    });
    return toPatientResponseDTO(updated);
  }
}
