import type {
  Appointment,
  AppointmentFilters,
  AppointmentWithRelations,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "../entities/Appointment";
import type { PaginationQuery } from "../shared/pagination";

export interface IAppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findByIdWithRelations(id: string): Promise<AppointmentWithRelations | null>;
  findByPatientId(patientId: string, filters?: Pick<AppointmentFilters, "status" | "dateStart" | "dateEnd">): Promise<Appointment[]>;
  findByUserId(userId: string, filters?: Pick<AppointmentFilters, "status" | "dateStart" | "dateEnd">): Promise<Appointment[]>;
  findAll(filters?: AppointmentFilters, pagination?: PaginationQuery): Promise<Appointment[]>;
  count(filters?: AppointmentFilters): Promise<number>;
  create(data: CreateAppointmentData): Promise<Appointment>;
  update(id: string, data: UpdateAppointmentData): Promise<Appointment>;
  delete(id: string): Promise<void>;
}
