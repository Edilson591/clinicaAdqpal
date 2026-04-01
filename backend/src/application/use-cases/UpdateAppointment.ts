import type { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository";
import type { UpdateAppointmentDTO, AppointmentResponseDTO } from "../dtos/AppointmentDTOs";
import { NotFoundError } from "../../domain/errors/DomainError";
import { toAppointmentResponseDTO } from "../mappers/appointmentMapper";

export class UpdateAppointment {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(id: string, dto: UpdateAppointmentDTO): Promise<AppointmentResponseDTO> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) throw new NotFoundError("Consulta");

    const updated = await this.appointmentRepository.update(id, dto);
    return toAppointmentResponseDTO(updated);
  }
}
