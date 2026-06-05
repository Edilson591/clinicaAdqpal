import type { SusProcedure, SusProcedureData } from "../entities/SusProcedure";

export interface ISusProcedureRepository {
  findByCodigo(codigo: string): Promise<SusProcedure | null>;
  findAll(): Promise<SusProcedure[]>;
  upsertMany(data: SusProcedureData[]): Promise<number>;
  deleteAll(): Promise<void>;
  count(): Promise<number>;
}
