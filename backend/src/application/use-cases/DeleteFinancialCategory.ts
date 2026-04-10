import type { IFinancialCategoryRepository } from "../../domain/repositories/IFinancialCategoryRepository";
import { NotFoundError, DomainError } from "../../domain/errors/DomainError";

export class DeleteFinancialCategory {
  constructor(private readonly repo: IFinancialCategoryRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError("Categoria não encontrada");
    if (existing.isDefault) throw new DomainError("Categorias padrão não podem ser removidas", 400);
    await this.repo.delete(id);
  }
}
