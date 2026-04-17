// =============================================================================
// DOMAIN ENTITY: NotaFiscal
// =============================================================================

export type NotaFiscalStatus = "PENDENTE" | "EMITIDA" | "CANCELADA";

export interface NotaFiscal {
  id: string;
  numero: string;
  patientId: string;
  appointmentId: string | null;
  transactionId: string | null;
  createdBy: string;
  servico: string;
  valor: number;
  status: NotaFiscalStatus;
  dataEmissao: Date | null;
  pdfUrl: string | null;
  observacoes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotaFiscalFilters {
  search?: string;
  status?: NotaFiscalStatus;
  patientId?: string;
  dateStart?: string;
  dateEnd?: string;
}

export interface CreateNotaFiscalData {
  numero: string;
  patientId: string;
  appointmentId?: string | null;
  transactionId?: string | null;
  createdBy: string;
  servico: string;
  valor: number;
  observacoes?: string | null;
}

export interface UpdateNotaFiscalData {
  servico?: string;
  valor?: number;
  observacoes?: string | null;
  pdfUrl?: string | null;
  status?: NotaFiscalStatus;
  dataEmissao?: Date | null;
}
