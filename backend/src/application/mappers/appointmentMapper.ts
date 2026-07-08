import type { Appointment } from "../../domain/entities/Appointment";
import type { AppointmentResponseDTO } from "../dtos/AppointmentDTOs";

function formatSaoPauloDateTime(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}-03:00`;
}

export function toAppointmentResponseDTO(appointment: Appointment): AppointmentResponseDTO {
  return {
    id: appointment.id,
    userId: appointment.userId,
    patientId: appointment.patientId,
    scheduledAt: formatSaoPauloDateTime(appointment.scheduledAt),
    medico: appointment.medico,
    status: appointment.status,
    type: appointment.type,
    pacient: appointment.pacient ?? null,
    specialtyId: appointment.specialtyId,
    roomId: appointment.roomId,
    meetingLink: appointment.meetingLink,
    address: appointment.address,
    notes: appointment.notes,
    medicalRecordId: appointment.medicalRecordId ?? null,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
  };
}
