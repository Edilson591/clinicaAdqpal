import type { INotaFiscalRepository } from "../../domain/repositories/INotaFiscalRepository";
import type { NotaFiscalResponseDTO } from "../dtos/NotaFiscalDTOs";
import { NotFoundError } from "../../domain/errors/DomainError";
import { toNotaFiscalResponseDTO } from "../mappers/notaFiscalMapper";
import type { NotaFiscalFilters } from "../../domain/entities/NotaFiscal";
import { toPaginatedResult, type PaginatedResult, type PaginationQuery } from "../../domain/shared/pagination";

export class GetNotaFiscal {
  constructor(private readonly notaFiscalRepository: INotaFiscalRepository) {}

  async executeById(id: string): Promise<NotaFiscalResponseDTO> {
    const nf = await this.notaFiscalRepository.findById(id);
    if (!nf) throw new NotFoundError("Nota fiscal não encontrada.");
    return toNotaFiscalResponseDTO(nf);
  }

  async executeList(
    pagination?: PaginationQuery,
    filters?: NotaFiscalFilters,
  ): Promise<PaginatedResult<NotaFiscalResponseDTO>> {
    const [data, total] = await Promise.all([
      this.notaFiscalRepository.findAll(pagination, filters),
      this.notaFiscalRepository.count(filters),
    ]);

    return toPaginatedResult(
      data.map(toNotaFiscalResponseDTO),
      total,
      pagination ?? { page: 1, limit: total },
    );
    // return {
    //   data: data.map(toNotaFiscalResponseDTO),
    //   total,
    //   page: pagination?.page ?? 1,
    //   limit: pagination?.limit ?? total,
    // };
  }

  async executeByPatient(
    patientId: string,
    pagination?: PaginationQuery,
  ): Promise<{
    data: NotaFiscalResponseDTO[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await Promise.all([
      this.notaFiscalRepository.findByPatient(patientId, pagination),
      this.notaFiscalRepository.countByPatient(patientId),
    ]);

    return {
      data: data.map(toNotaFiscalResponseDTO),
      total,
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? total,
    };
  }
}
