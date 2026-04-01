// =============================================================================
// Paginação compartilhada — usada em todos os endpoints de listagem
// =============================================================================

export interface PaginationQuery {
  page: number;   // default 1
  limit: number;  // default 20, máximo 100
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Extrai e normaliza page/limit de req.query */
export function parsePagination(raw: Record<string, unknown>): PaginationQuery {
  const page  = Math.max(1, Number(raw.page)  || 1);
  const limit = Math.min(100, Math.max(1, Number(raw.limit) || 20));
  return { page, limit };
}

/** Monta o objeto de resposta paginada */
export function toPaginatedResult<T>(
  data: T[],
  total: number,
  { page, limit }: PaginationQuery,
): PaginatedResult<T> {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
