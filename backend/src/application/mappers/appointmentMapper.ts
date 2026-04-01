import type { Appointment } from "../../domain/entities/Appointment";
import type { AppointmentResponseDTO } from "../dtos/AppointmentDTOs";

export function toAppointmentResponseDTO(appointment: Appointment): AppointmentResponseDTO {
  return {
    id: appointment.id,
    userId: appointment.userId,
    patientId: appointment.patientId,
    scheduledAt: appointment.scheduledAt.toISOString(),
    medico: appointment.medico,
    status: appointment.status,
    notes: appointment.notes,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
  };
}
