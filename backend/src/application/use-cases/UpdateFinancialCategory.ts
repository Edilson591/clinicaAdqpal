import type { IFinancialCategoryRepository } from "../../domain/repositories/IFinancialCategoryRepository";
import type { UpdateFinancialCategoryDTO, FinancialCategoryResponseDTO } from "../dtos/FinancialDTOs";
import { toFinancialCategoryResponseDTO } from "../mappers/financialMapper";
import { NotFoundError } from "../../domain/errors/DomainError";

export class UpdateFinancialCategory {
  constructor(private readonly repo: IFinancialCategoryRepository) {}

  async execute(id: string, dto: UpdateFinancialCategoryDTO): Promise<FinancialCategoryResponseDTO> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError("Categoria não encontrada");

    const category = await this.repo.update(id, dto);
    return toFinancialCategoryResponseDTO(category);
  }
}
