import type { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository";
import type { CreateAppointmentDTO, AppointmentResponseDTO } from "../dtos/AppointmentDTOs";
import { toAppointmentResponseDTO } from "../mappers/appointmentMapper";

export class CreateAppointment {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(dto: CreateAppointmentDTO): Promise<AppointmentResponseDTO> {
    const appointment = await this.appointmentRepository.create({
      userId: dto.userId,
      patientId: dto.patientId,
      scheduledAt: dto.scheduledAt,
      notes: dto.notes ?? null,
    });
    return toAppointmentResponseDTO(appointment);
  }
}
