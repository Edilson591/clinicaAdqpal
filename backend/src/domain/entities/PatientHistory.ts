export type PatientHistoryType =
  | "CONSULTA"
  | "EXAME"
  | "PRESCRICAO"
  | "OBSERVACAO"
  | "SOLICITACAO";

export interface PatientHistory {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string | null;
  type: PatientHistoryType;
  title: string;
  description: string;
  attachments: string[];
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatientHistoryData {
  patientId: string;
  doctorId: string;
  appointmentId?: string | null;
  type: PatientHistoryType;
  title: string;
  description: string;
  attachments?: string[];
}
