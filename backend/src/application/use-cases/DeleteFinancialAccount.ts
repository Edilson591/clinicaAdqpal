import type { IFinancialAccountRepository } from "../../domain/repositories/IFinancialAccountRepository";
import { NotFoundError } from "../../domain/errors/DomainError";

export class DeleteFinancialAccount {
  constructor(private readonly repo: IFinancialAccountRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError("Conta financeira não encontrada");
    await this.repo.delete(id);
  }
}
