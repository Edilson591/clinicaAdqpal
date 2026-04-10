import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import type { CreateTransactionDTO, TransactionResponseDTO } from "../dtos/FinancialDTOs";
import { toTransactionResponseDTO } from "../mappers/financialMapper";

export class CreateTransaction {
  constructor(private readonly repo: ITransactionRepository) {}

  async execute(dto: CreateTransactionDTO): Promise<TransactionResponseDTO> {
    const tx = await this.repo.create({
      accountId: dto.accountId,
      categoryId: dto.categoryId,
      patientId: dto.patientId ?? null,
      appointmentId: dto.appointmentId ?? null,
      createdBy: dto.createdBy,
      type: dto.type,
      amount: dto.amount,
      description: dto.description,
      status: dto.status ?? "PENDING",
      paymentMethod: dto.paymentMethod ?? "OTHER",
      dueDate: dto.dueDate,
      paidAt: dto.paidAt ?? null,
      reference: dto.reference ?? null,
      isRecurring: dto.isRecurring ?? false,
      recurringGroupId: dto.recurringGroupId ?? null,
      installmentNumber: dto.installmentNumber ?? null,
      totalInstallments: dto.totalInstallments ?? null,
      transferToAccountId: dto.transferToAccountId ?? null,
      tags: dto.tags ?? [],
      attachmentUrl: dto.attachmentUrl ?? null,
      deletedAt: null,
    });
    return toTransactionResponseDTO(tx);
  }
}
