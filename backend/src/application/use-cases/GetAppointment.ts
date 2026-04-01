import type { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository";
import type { AppointmentFilters } from "../../domain/entities/Appointment";
import type { AppointmentResponseDTO } from "../dtos/AppointmentDTOs";
import { NotFoundError } from "../../domain/errors/DomainError";
import { toAppointmentResponseDTO } from "../mappers/appointmentMapper";
import type { PaginationQuery, PaginatedResult } from "../../domain/shared/pagination";
import { toPaginatedResult } from "../../domain/shared/pagination";

export class GetAppointment {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(id: string): Promise<AppointmentResponseDTO> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) throw new NotFoundError("Consulta");
    return toAppointmentResponseDTO(appointment);
  }
}

export class ListAppointments {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(
    filters?: AppointmentFilters,
    pagination?: PaginationQuery,
  ): Promise<PaginatedResult<AppointmentResponseDTO>> {
    const pg: PaginationQuery = pagination ?? { page: 1, limit: 20 };
    const [appointments, total] = await Promise.all([
      this.appointmentRepository.findAll(filters, pg),
      this.appointmentRepository.count(filters),
    ]);
    return toPaginatedResult(appointments.map(toAppointmentResponseDTO), total, pg);
  }
}

export class ListAppointmentsByPatient {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(
    patientId: string,
    filters?: Pick<AppointmentFilters, "status" | "dateStart" | "dateEnd">,
  ): Promise<AppointmentResponseDTO[]> {
    const appointments = await this.appointmentRepository.findByPatientId(patientId, filters);
    return appointments.map(toAppointmentResponseDTO);
  }
}

export class ListAppointmentsByUser {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(
    userId: string,
    filters?: Pick<AppointmentFilters, "status" | "dateStart" | "dateEnd">,
  ): Promise<AppointmentResponseDTO[]> {
    const appointments = await this.appointmentRepository.findByUserId(userId, filters);
    return appointments.map(toAppointmentResponseDTO);
  }
}
