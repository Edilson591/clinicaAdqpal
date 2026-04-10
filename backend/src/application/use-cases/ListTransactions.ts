import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import type { ListTransactionsQuery, TransactionResponseDTO } from "../dtos/FinancialDTOs";
import { toTransactionResponseDTO } from "../mappers/financialMapper";
import type { PaginatedResult } from "../../domain/shared/pagination";

export class ListTransactions {
  constructor(private readonly repo: ITransactionRepository) {}

  async execute(query: ListTransactionsQuery): Promise<PaginatedResult<TransactionResponseDTO>> {
    const result = await this.repo.findAll({
      accountId: query.accountId,
      categoryId: query.categoryId,
      patientId: query.patientId,
      appointmentId: query.appointmentId,
      type: query.type,
      status: query.status,
      paymentMethod: query.paymentMethod,
      dateStart: query.dateStart,
      dateEnd: query.dateEnd,
      search: query.search,
      page: query.page,
      limit: query.limit,
    });
    return {
      data: result.data.map(toTransactionResponseDTO),
      pagination: result.pagination,
    };
  }
}
