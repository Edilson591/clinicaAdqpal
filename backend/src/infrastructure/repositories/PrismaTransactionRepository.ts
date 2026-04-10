import { prisma } from "../database/prismaClient";
import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import type { Transaction, TransactionFilters } from "../../domain/entities/Transaction";
import type { PaginatedResult } from "../../domain/shared/pagination";

export class PrismaTransactionRepository implements ITransactionRepository {
  private readonly include = {
    account: { select: { id: true, name: true, color: true } },
    category: { select: { id: true, name: true, color: true } },
    patient: { select: { id: true, name: true } },
  };

  async create(
    data: Omit<Transaction, "id" | "account" | "category" | "patient" | "createdAt" | "updatedAt">
  ): Promise<Transaction> {
    const row = await prisma.transaction.create({ data, include: this.include });
    return this.toDomain(row);
  }

  async findAll(filters?: TransactionFilters): Promise<PaginatedResult<Transaction>> {
    const where = this.buildWhere(filters);
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;

    const [total, rows] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        include: this.include,
        orderBy: { dueDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: rows.map(this.toDomain),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Transaction | null> {
    const row = await prisma.transaction.findUnique({ where: { id }, include: this.include });
    return row ? this.toDomain(row) : null;
  }

  async update(
    id: string,
    data: Partial<Omit<Transaction, "id" | "account" | "category" | "patient" | "createdAt" | "updatedAt">>
  ): Promise<Transaction> {
    const row = await prisma.transaction.update({ where: { id }, data, include: this.include });
    return this.toDomain(row);
  }

  async softDelete(id: string): Promise<void> {
    await prisma.transaction.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  private buildWhere(filters?: TransactionFilters) {
    const where: Record<string, unknown> = { deletedAt: null };

    if (filters?.accountId) where.accountId = filters.accountId;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.patientId) where.patientId = filters.patientId;
    if (filters?.appointmentId) where.appointmentId = filters.appointmentId;
    if (filters?.type) where.type = filters.type;
    if (filters?.status) where.status = filters.status;
    if (filters?.paymentMethod) where.paymentMethod = filters.paymentMethod;

    if (filters?.dateStart || filters?.dateEnd) {
      where.dueDate = {
        ...(filters.dateStart ? { gte: filters.dateStart } : {}),
        ...(filters.dateEnd ? { lte: filters.dateEnd } : {}),
      };
    }

    if (filters?.search) {
      where.description = { contains: filters.search, mode: "insensitive" };
    }

    return where;
  }

  private toDomain(row: {
    id: string;
    accountId: string;
    categoryId: string;
    patientId: string | null;
    appointmentId: string | null;
    createdBy: string;
    type: string;
    amount: { toNumber(): number };
    description: string;
    status: string;
    paymentMethod: string;
    dueDate: Date;
    paidAt: Date | null;
    reference: string | null;
    isRecurring: boolean;
    recurringGroupId: string | null;
    installmentNumber: number | null;
    totalInstallments: number | null;
    transferToAccountId: string | null;
    tags: string[];
    attachmentUrl: string | null;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    account?: { id: string; name: string; color: string | null } | null;
    category?: { id: string; name: string; color: string | null } | null;
    patient?: { id: string; name: string } | null;
  }): Transaction {
    return {
      id: row.id,
      accountId: row.accountId,
      categoryId: row.categoryId,
      patientId: row.patientId,
      appointmentId: row.appointmentId,
      createdBy: row.createdBy,
      type: row.type as Transaction["type"],
      amount: row.amount.toNumber(),
      description: row.description,
      status: row.status as Transaction["status"],
      paymentMethod: row.paymentMethod as Transaction["paymentMethod"],
      dueDate: row.dueDate,
      paidAt: row.paidAt,
      reference: row.reference,
      isRecurring: row.isRecurring,
      recurringGroupId: row.recurringGroupId,
      installmentNumber: row.installmentNumber,
      totalInstallments: row.totalInstallments,
      transferToAccountId: row.transferToAccountId,
      tags: row.tags,
      attachmentUrl: row.attachmentUrl,
      deletedAt: row.deletedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      account: row.account ?? null,
      category: row.category ?? null,
      patient: row.patient ?? null,
    };
  }
}
