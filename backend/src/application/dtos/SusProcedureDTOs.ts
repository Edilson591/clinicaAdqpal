export interface SusProcedureResponseDTO {
  id: string;
  codigo: string;
  nome: string;
  modalidade: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncSusResultDTO {
  total: number;
  message: string;
}
