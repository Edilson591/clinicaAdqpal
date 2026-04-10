import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { NotFoundError } from "../../domain/errors/DomainError";

export class DeleteTransaction {
  constructor(private readonly repo: ITransactionRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing || existing.deletedAt) throw new NotFoundError("Transação não encontrada");
    await this.repo.softDelete(id);
  }
}
