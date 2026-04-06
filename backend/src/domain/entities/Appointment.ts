// =============================================================================
// DOMAIN ENTITY: Appointment
// =============================================================================

export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface Appointment {
  id: string;
  userId: string;
  patientId: string;
  scheduledAt: Date;
  medico: string | null;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentWithRelations extends Appointment {
  patient: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
  };
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface CreateAppointmentData {
  userId: string;
  patientId: string;
  scheduledAt: Date;
  medico?: string | null;
  notes?: string | null;
}

export interface UpdateAppointmentData {
  userId?: string;
  patientId?: string;
  scheduledAt?: Date;
  medico?: string | null;
  status?: AppointmentStatus;
  notes?: string | null;
}

// Filtros reutilizáveis entre os métodos do repositório
export interface AppointmentFilters {
  userId?: string;
  patientId?: string;
  status?: AppointmentStatus;
  /** Dia específico — o repositório converte para gte início do dia / lte fim do dia */
  date?: Date;
  /** Hora de início dentro do dia (HH:MM) — exige `date` */
  timeStart?: string;
  /** Hora de fim dentro do dia (HH:MM) — exige `date` */
  timeEnd?: string;
  dateStart?: Date;
  dateEnd?: Date;
  /** Busca por nome do paciente ou campo medico (case-insensitive) */
  search?: string;
}
