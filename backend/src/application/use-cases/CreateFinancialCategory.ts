import type { IFinancialCategoryRepository } from "../../domain/repositories/IFinancialCategoryRepository";
import type { CreateFinancialCategoryDTO, FinancialCategoryResponseDTO } from "../dtos/FinancialDTOs";
import { toFinancialCategoryResponseDTO } from "../mappers/financialMapper";

export class CreateFinancialCategory {
  constructor(private readonly repo: IFinancialCategoryRepository) {}

  async execute(dto: CreateFinancialCategoryDTO): Promise<FinancialCategoryResponseDTO> {
    const category = await this.repo.create({
      name: dto.name,
      type: dto.type,
      color: dto.color ?? null,
      icon: dto.icon ?? null,
      parentId: dto.parentId ?? null,
      isDefault: false,
      isActive: true,
    });
    return toFinancialCategoryResponseDTO(category);
  }
}
