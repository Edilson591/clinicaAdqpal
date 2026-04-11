import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import {
  financialKeys,
  useFinancialAccountById,
  useTransactionById,
  useCreateTransaction,
  useDeleteTransaction,
  useCreateFinancialAccount,
  useDeleteFinancialAccount,
  useCreateFinancialCategory,
  useDeleteFinancialCategory,
  useDashboardFinance,
} from '../../hooks/useFinancial';

// ── Service mocks ─────────────────────────────────────────────────────────────

vi.mock('../../services/Financial', () => ({
  FinancialAccountService: {
    getAll: vi.fn().mockResolvedValue([]),
    getById: vi.fn().mockResolvedValue({ id: 'acc-1' }),
    create: vi.fn().mockResolvedValue({ id: 'acc-new' }),
    update: vi.fn().mockResolvedValue({ id: 'acc-1' }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
  FinancialCategoryService: {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({ id: 'cat-new' }),
    update: vi.fn().mockResolvedValue({ id: 'cat-1' }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
  TransactionService: {
    getAll: vi.fn().mockResolvedValue({ data: [], pagination: {} }),
    getById: vi.fn().mockResolvedValue({ id: 'tx-1' }),
    create: vi.fn().mockResolvedValue({ id: 'tx-new' }),
    update: vi.fn().mockResolvedValue({ id: 'tx-1' }),
    delete: vi.fn().mockResolvedValue(undefined),
  },
  DashboardService: {
    getDashboard: vi.fn().mockResolvedValue({ income: 1000, expense: 500 }),
  },
}));

// ── Wrapper ───────────────────────────────────────────────────────────────────

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
}

beforeEach(() => vi.clearAllMocks());

// ── Query key structure ───────────────────────────────────────────────────────

describe('financialKeys', () => {
  it('accounts.all key', () => {
    expect(financialKeys.accounts.all).toEqual(['financial', 'accounts']);
  });

  it('accounts.list includes isActive filter', () => {
    expect(financialKeys.accounts.list(true)).toEqual([
      'financial', 'accounts', 'list', { isActive: true },
    ]);
  });

  it('accounts.detail includes id', () => {
    expect(financialKeys.accounts.detail('acc-1')).toEqual(['financial', 'accounts', 'acc-1']);
  });

  it('categories.all key', () => {
    expect(financialKeys.categories.all).toEqual(['financial', 'categories']);
  });

  it('categories.list includes type and isActive', () => {
    expect(financialKeys.categories.list('INCOME', true)).toEqual([
      'financial', 'categories', 'list', { type: 'INCOME', isActive: true },
    ]);
  });

  it('transactions.all key', () => {
    expect(financialKeys.transactions.all).toEqual(['financial', 'transactions']);
  });

  it('transactions.list includes filters object', () => {
    const filters = { type: 'INCOME' as const };
    expect(financialKeys.transactions.list(filters)).toEqual([
      'financial', 'transactions', 'list', filters,
    ]);
  });

  it('transactions.detail includes id', () => {
    expect(financialKeys.transactions.detail('tx-1')).toEqual([
      'financial', 'transactions', 'tx-1',
    ]);
  });
});

// ── useFinancialAccountById ───────────────────────────────────────────────────

describe('useFinancialAccountById', () => {
  it('is disabled when id is empty', () => {
    const { result } = renderHook(() => useFinancialAccountById(''), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches when id is provided', async () => {
    const { result } = renderHook(() => useFinancialAccountById('acc-1'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 'acc-1' });
  });
});

// ── useTransactionById ────────────────────────────────────────────────────────

describe('useTransactionById', () => {
  it('is disabled when id is empty', () => {
    const { result } = renderHook(() => useTransactionById(''), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches when id is provided', async () => {
    const { result } = renderHook(() => useTransactionById('tx-1'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 'tx-1' });
  });
});

// ── useDashboardFinance ───────────────────────────────────────────────────────

describe('useDashboardFinance', () => {
  it('is disabled when month is empty', () => {
    const { result } = renderHook(() => useDashboardFinance(''), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches when month is provided', async () => {
    const { result } = renderHook(() => useDashboardFinance('2026-04'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ income: 1000, expense: 500 });
  });
});

// ── useCreateTransaction ──────────────────────────────────────────────────────

describe('useCreateTransaction', () => {
  it('calls TransactionService.create on mutate', async () => {
    const { TransactionService } = await import('../../services/Financial');
    const { result } = renderHook(() => useCreateTransaction(), {
      wrapper: makeWrapper(),
    });

    const payload = { description: 'Consulta', amount: '200' };
    result.current.mutate(payload);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(TransactionService.create).toHaveBeenCalledWith(payload);
  });
});

// ── useDeleteTransaction ──────────────────────────────────────────────────────

describe('useDeleteTransaction', () => {
  it('calls TransactionService.delete on mutate', async () => {
    const { TransactionService } = await import('../../services/Financial');
    const { result } = renderHook(() => useDeleteTransaction(), {
      wrapper: makeWrapper(),
    });

    result.current.mutate('tx-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(TransactionService.delete).toHaveBeenCalledWith('tx-1');
  });
});

// ── useCreateFinancialAccount ─────────────────────────────────────────────────

describe('useCreateFinancialAccount', () => {
  it('calls FinancialAccountService.create on mutate', async () => {
    const { FinancialAccountService } = await import('../../services/Financial');
    const { result } = renderHook(() => useCreateFinancialAccount(), {
      wrapper: makeWrapper(),
    });

    const payload = { name: 'Conta Principal', type: 'CHECKING' };
    result.current.mutate(payload);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(FinancialAccountService.create).toHaveBeenCalledWith(payload);
  });
});

// ── useDeleteFinancialAccount ─────────────────────────────────────────────────

describe('useDeleteFinancialAccount', () => {
  it('calls FinancialAccountService.delete on mutate', async () => {
    const { FinancialAccountService } = await import('../../services/Financial');
    const { result } = renderHook(() => useDeleteFinancialAccount(), {
      wrapper: makeWrapper(),
    });

    result.current.mutate('acc-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(FinancialAccountService.delete).toHaveBeenCalledWith('acc-1');
  });
});

// ── useCreateFinancialCategory ────────────────────────────────────────────────

describe('useCreateFinancialCategory', () => {
  it('calls FinancialCategoryService.create on mutate', async () => {
    const { FinancialCategoryService } = await import('../../services/Financial');
    const { result } = renderHook(() => useCreateFinancialCategory(), {
      wrapper: makeWrapper(),
    });

    const payload = { name: 'Consultas', type: 'INCOME' };
    result.current.mutate(payload);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(FinancialCategoryService.create).toHaveBeenCalledWith(payload);
  });
});

// ── useDeleteFinancialCategory ────────────────────────────────────────────────

describe('useDeleteFinancialCategory', () => {
  it('calls FinancialCategoryService.delete on mutate', async () => {
    const { FinancialCategoryService } = await import('../../services/Financial');
    const { result } = renderHook(() => useDeleteFinancialCategory(), {
      wrapper: makeWrapper(),
    });

    result.current.mutate('cat-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(FinancialCategoryService.delete).toHaveBeenCalledWith('cat-1');
  });
});
