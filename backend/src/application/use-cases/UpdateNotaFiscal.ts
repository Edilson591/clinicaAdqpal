import type { INotaFiscalRepository } from "../../domain/repositories/INotaFiscalRepository";
import type { UpdateNotaFiscalDTO, NotaFiscalResponseDTO } from "../dtos/NotaFiscalDTOs";
import { NotFoundError, DomainError } from "../../domain/errors/DomainError";
import { toNotaFiscalResponseDTO } from "../mappers/notaFiscalMapper";

export class UpdateNotaFiscal {
  constructor(private readonly notaFiscalRepository: INotaFiscalRepository) {}

  async execute(id: string, dto: UpdateNotaFiscalDTO): Promise<NotaFiscalResponseDTO> {
    const existing = await this.notaFiscalRepository.findById(id);
    if (!existing) throw new NotFoundError("Nota fiscal não encontrada.");

    if (existing.status === "CANCELADA") {
      throw new DomainError("Não é possível editar uma nota fiscal cancelada.", 422);
    }

    if (existing.status === "EMITIDA") {
      throw new DomainError("Não é possível editar uma nota fiscal já emitida.", 422);
    }

    const nf = await this.notaFiscalRepository.update(id, dto);
    return toNotaFiscalResponseDTO(nf);
  }
}
