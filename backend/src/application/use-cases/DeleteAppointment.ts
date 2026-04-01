import type { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository";
import { NotFoundError } from "../../domain/errors/DomainError";

export class DeleteAppointment {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) throw new NotFoundError("Consulta");
    await this.appointmentRepository.delete(id);
  }
}
