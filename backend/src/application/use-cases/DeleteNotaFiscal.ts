import type { INotaFiscalRepository } from "../../domain/repositories/INotaFiscalRepository";
import { NotFoundError, DomainError } from "../../domain/errors/DomainError";

export class DeleteNotaFiscal {
  constructor(private readonly notaFiscalRepository: INotaFiscalRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.notaFiscalRepository.findById(id);
    if (!existing) throw new NotFoundError("Nota fiscal não encontrada.");

    if (existing.status === "EMITIDA") {
      throw new DomainError("Não é possível deletar uma nota fiscal emitida. Cancele primeiro.", 422);
    }

    await this.notaFiscalRepository.delete(id);
  }
}
