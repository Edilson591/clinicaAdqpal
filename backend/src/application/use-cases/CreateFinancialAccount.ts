import type { IFinancialAccountRepository } from "../../domain/repositories/IFinancialAccountRepository";
import type { CreateFinancialAccountDTO, FinancialAccountResponseDTO } from "../dtos/FinancialDTOs";
import { toFinancialAccountResponseDTO } from "../mappers/financialMapper";

export class CreateFinancialAccount {
  constructor(private readonly repo: IFinancialAccountRepository) {}

  async execute(dto: CreateFinancialAccountDTO): Promise<FinancialAccountResponseDTO> {
    const account = await this.repo.create({
      name: dto.name,
      type: dto.type,
      bank: dto.bank ?? null,
      initialBalance: dto.initialBalance ?? 0,
      currency: dto.currency ?? "BRL",
      isActive: true,
      isDefault: dto.isDefault ?? false,
      color: dto.color ?? null,
    });
    const balance = await this.repo.getBalance(account.id);
    return toFinancialAccountResponseDTO({ ...account, currentBalance: balance });
  }
}
