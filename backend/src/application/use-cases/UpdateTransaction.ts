import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import type { UpdateTransactionDTO, TransactionResponseDTO } from "../dtos/FinancialDTOs";
import { toTransactionResponseDTO } from "../mappers/financialMapper";
import { NotFoundError } from "../../domain/errors/DomainError";

export class UpdateTransaction {
  constructor(private readonly repo: ITransactionRepository) {}

  async execute(id: string, dto: UpdateTransactionDTO): Promise<TransactionResponseDTO> {
    const existing = await this.repo.findById(id);
    if (!existing || existing.deletedAt) throw new NotFoundError("Transação não encontrada");

    const tx = await this.repo.update(id, dto);
    return toTransactionResponseDTO(tx);
  }
}
