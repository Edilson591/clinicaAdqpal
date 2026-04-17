import type { INotaFiscalRepository } from "../../domain/repositories/INotaFiscalRepository";
import type { NotaFiscalResponseDTO } from "../dtos/NotaFiscalDTOs";
import { NotFoundError, DomainError } from "../../domain/errors/DomainError";
import { toNotaFiscalResponseDTO } from "../mappers/notaFiscalMapper";

export class EmitirNotaFiscal {
  constructor(private readonly notaFiscalRepository: INotaFiscalRepository) {}

  async execute(id: string): Promise<NotaFiscalResponseDTO> {
    const existing = await this.notaFiscalRepository.findById(id);
    if (!existing) throw new NotFoundError("Nota fiscal não encontrada.");

    if (existing.status === "EMITIDA") {
      throw new DomainError("Nota fiscal já foi emitida.", 422);
    }

    if (existing.status === "CANCELADA") {
      throw new DomainError("Não é possível emitir uma nota fiscal cancelada.", 422);
    }

    const nf = await this.notaFiscalRepository.update(id, {
      status: "EMITIDA",
      dataEmissao: new Date(),
    });

    return toNotaFiscalResponseDTO(nf);
  }
}
