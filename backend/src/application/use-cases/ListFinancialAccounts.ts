import type { IFinancialAccountRepository } from "../../domain/repositories/IFinancialAccountRepository";
import type { FinancialAccountResponseDTO } from "../dtos/FinancialDTOs";
import type { FinancialAccountFilters } from "../../domain/entities/FinancialAccount";
import { toFinancialAccountResponseDTO } from "../mappers/financialMapper";

export class ListFinancialAccounts {
  constructor(private readonly repo: IFinancialAccountRepository) {}

  async execute(filters?: FinancialAccountFilters): Promise<FinancialAccountResponseDTO[]> {
    const accounts = await this.repo.findAll(filters);
    return Promise.all(
      accounts.map(async (a) => {
        const balance = await this.repo.getBalance(a.id);
        return toFinancialAccountResponseDTO({ ...a, currentBalance: balance });
      })
    );
  }
}
