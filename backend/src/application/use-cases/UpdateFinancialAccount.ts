import type { IFinancialAccountRepository } from "../../domain/repositories/IFinancialAccountRepository";
import type { UpdateFinancialAccountDTO, FinancialAccountResponseDTO } from "../dtos/FinancialDTOs";
import { toFinancialAccountResponseDTO } from "../mappers/financialMapper";
import { NotFoundError } from "../../domain/errors/DomainError";

export class UpdateFinancialAccount {
  constructor(private readonly repo: IFinancialAccountRepository) {}

  async execute(id: string, dto: UpdateFinancialAccountDTO): Promise<FinancialAccountResponseDTO> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError("Conta financeira não encontrada");

    const account = await this.repo.update(id, dto);
    const balance = await this.repo.getBalance(id);
    return toFinancialAccountResponseDTO({ ...account, currentBalance: balance });
  }
}
