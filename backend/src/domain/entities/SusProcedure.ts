export interface SusProcedure {
  id: string;
  codigo: string;
  nome: string;
  modalidade: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SusProcedureData {
  codigo: string;
  nome: string;
  modalidade: string;
}
