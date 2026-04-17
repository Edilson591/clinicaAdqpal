import type { NotaFiscal, CreateNotaFiscalData, UpdateNotaFiscalData, NotaFiscalFilters } from "../entities/NotaFiscal";
import type { PaginationQuery } from "../shared/pagination";

export interface INotaFiscalRepository {
  findById(id: string): Promise<NotaFiscal | null>;
  findByNumero(numero: string): Promise<NotaFiscal | null>;
  findAll(pagination?: PaginationQuery, filters?: NotaFiscalFilters): Promise<NotaFiscal[]>;
  findByPatient(patientId: string, pagination?: PaginationQuery): Promise<NotaFiscal[]>;
  count(filters?: NotaFiscalFilters): Promise<number>;
  countByPatient(patientId: string): Promise<number>;
  getNextNumero(): Promise<string>;
  create(data: CreateNotaFiscalData): Promise<NotaFiscal>;
  update(id: string, data: UpdateNotaFiscalData): Promise<NotaFiscal>;
  delete(id: string): Promise<void>;
}
