import type { IFinancialCategoryRepository } from "../../domain/repositories/IFinancialCategoryRepository";
import type { FinancialCategoryResponseDTO } from "../dtos/FinancialDTOs";
import type { FinancialCategoryFilters } from "../../domain/entities/FinancialCategory";
import { toFinancialCategoryResponseDTO } from "../mappers/financialMapper";

export class ListFinancialCategories {
  constructor(private readonly repo: IFinancialCategoryRepository) {}

  async execute(filters?: FinancialCategoryFilters): Promise<FinancialCategoryResponseDTO[]> {
    const categories = await this.repo.findAll(filters);
    return categories.map(toFinancialCategoryResponseDTO);
  }
}
