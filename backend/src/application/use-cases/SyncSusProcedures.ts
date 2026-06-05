import type { ISusProcedureRepository } from "../../domain/repositories/ISusProcedureRepository";
import { SusSyncService } from "../../infrastructure/services/SusSyncService";
import type { SyncSusResultDTO } from "../dtos/SusProcedureDTOs";

export class SyncSusProcedures {
  constructor(
    private readonly repository: ISusProcedureRepository,
    private readonly syncService: SusSyncService,
  ) {}

  async execute(): Promise<SyncSusResultDTO> {
    const procedimentos = await this.syncService.fetchAndParse();

    if (procedimentos.length === 0) {
      return { total: 0, message: "Nenhum procedimento encontrado para sincronizar." };
    }

    const count = await this.repository.upsertMany(procedimentos);

    return {
      total: count,
      message: `${count} procedimentos sincronizados com sucesso.`,
    };
  }
}
