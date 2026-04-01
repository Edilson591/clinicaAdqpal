import type { IPatientRepository } from "../../domain/repositories/IPatientRepository";
import { NotFoundError } from "../../domain/errors/DomainError";

export class DeletePatient {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(id: string): Promise<void> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) throw new NotFoundError("Paciente");
    await this.patientRepository.delete(id);
  }
}
