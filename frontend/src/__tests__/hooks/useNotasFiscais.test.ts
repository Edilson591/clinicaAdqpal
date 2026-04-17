import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import {
  useNotasFiscaisPaginated,
  useNotasFiscaisStats,
  useCreateNotaFiscal,
  useEmitirNotaFiscal,
  useCancelarNotaFiscal,
  useDeleteNotaFiscal,
  useNotasFiscaisPage,
} from '../../hooks/useNotasFiscais';

// ── Service mock ──────────────────────────────────────────────────────────────

const mockNF = {
  id: 'nf-1',
  numero: 'NF-000001',
  patientId: 'patient-1',
  appointmentId: null,
  transactionId: null,
  createdBy: 'user-1',
  servico: 'Consulta médica',
  valor: 250,
  status: 'EMITIDA' as const,
  dataEmissao: '2026-04-16T00:00:00.000Z',
  pdfUrl: null,
  observacoes: null,
  createdAt: '2026-04-16T00:00:00.000Z',
  updatedAt: '2026-04-16T00:00:00.000Z',
};

const mockPaginated = {
  data: [mockNF],
  pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
};

vi.mock('../../services/NotaFiscal', () => {
  const nf = {
    id: 'nf-1',
    numero: 'NF-000001',
    patientId: 'patient-1',
    appointmentId: null,
    transactionId: null,
    createdBy: 'user-1',
    servico: 'Consulta médica',
    valor: 250,
    status: 'EMITIDA',
    dataEmissao: '2026-04-16T00:00:00.000Z',
    pdfUrl: null,
    observacoes: null,
    createdAt: '2026-04-16T00:00:00.000Z',
    updatedAt: '2026-04-16T00:00:00.000Z',
  };
  return {
    NotaFiscalService: {
      getAll: vi.fn().mockResolvedValue({
        data: [nf],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      }),
      getById: vi.fn().mockResolvedValue(nf),
      create: vi.fn().mockResolvedValue(nf),
      emitir: vi.fn().mockResolvedValue({ ...nf, status: 'EMITIDA' }),
      cancelar: vi.fn().mockResolvedValue({ ...nf, status: 'CANCELADA' }),
      delete: vi.fn().mockResolvedValue(undefined),
    },
  };
});

// ── Wrapper ───────────────────────────────────────────────────────────────────

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
}

beforeEach(() => vi.clearAllMocks());

// ── useNotasFiscaisPaginated ──────────────────────────────────────────────────

describe('useNotasFiscaisPaginated', () => {
  it('returns paginated data from service', async () => {
    const { result } = renderHook(
      () => useNotasFiscaisPaginated(1, 10, '', ''),
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data[0].numero).toBe('NF-000001');
    expect(result.current.data?.pagination.total).toBe(1);
  });

  it('passes search and status filters to service', async () => {
    const { NotaFiscalService } = await import('../../services/NotaFiscal');
    renderHook(
      () => useNotasFiscaisPaginated(2, 5, 'consulta', 'EMITIDA'),
      { wrapper: makeWrapper() },
    );
    await waitFor(() =>
      expect(NotaFiscalService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 5, search: 'consulta', status: 'EMITIDA' }),
      ),
    );
  });

  it('omits empty search from filters', async () => {
    const { NotaFiscalService } = await import('../../services/NotaFiscal');
    renderHook(
      () => useNotasFiscaisPaginated(1, 10, '', ''),
      { wrapper: makeWrapper() },
    );
    await waitFor(() => expect(NotaFiscalService.getAll).toHaveBeenCalled());
    const call = (NotaFiscalService.getAll as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(call.search).toBeUndefined();
    expect(call.status).toBeUndefined();
  });
});

// ── useNotasFiscaisStats ──────────────────────────────────────────────────────

describe('useNotasFiscaisStats', () => {
  it('returns computed stats from service', async () => {
    const { result } = renderHook(() => useNotasFiscaisStats(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // mock returns total:1 for all status queries
    expect(result.current.totalEmitidas).toBe(1);
    expect(result.current.totalPendentes).toBe(1);
    expect(result.current.totalCanceladas).toBe(1);
  });

  it('sums valor from emitidas list', async () => {
    const { result } = renderHook(() => useNotasFiscaisStats(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // mockNF.valor = 250; one item returned
    expect(result.current.valorTotal).toBe(250);
  });
});

// ── useCreateNotaFiscal ───────────────────────────────────────────────────────

describe('useCreateNotaFiscal', () => {
  it('calls NotaFiscalService.create with payload', async () => {
    const { NotaFiscalService } = await import('../../services/NotaFiscal');
    const { result } = renderHook(() => useCreateNotaFiscal(), {
      wrapper: makeWrapper(),
    });

    const payload = { patientId: 'p-1', servico: 'Consulta', valor: 200 };
    result.current.mutate(payload);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(NotaFiscalService.create).toHaveBeenCalledWith(payload);
  });
});

// ── useEmitirNotaFiscal ───────────────────────────────────────────────────────

describe('useEmitirNotaFiscal', () => {
  it('calls NotaFiscalService.emitir with id', async () => {
    const { NotaFiscalService } = await import('../../services/NotaFiscal');
    const { result } = renderHook(() => useEmitirNotaFiscal(), {
      wrapper: makeWrapper(),
    });

    result.current.mutate('nf-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(NotaFiscalService.emitir).toHaveBeenCalledWith('nf-1');
  });

  it('returns the emitted NF in mutation data', async () => {
    const { result } = renderHook(() => useEmitirNotaFiscal(), {
      wrapper: makeWrapper(),
    });

    result.current.mutate('nf-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe('EMITIDA');
  });
});

// ── useCancelarNotaFiscal ─────────────────────────────────────────────────────

describe('useCancelarNotaFiscal', () => {
  it('calls NotaFiscalService.cancelar with id', async () => {
    const { NotaFiscalService } = await import('../../services/NotaFiscal');
    const { result } = renderHook(() => useCancelarNotaFiscal(), {
      wrapper: makeWrapper(),
    });

    result.current.mutate('nf-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(NotaFiscalService.cancelar).toHaveBeenCalledWith('nf-1');
  });
});

// ── useDeleteNotaFiscal ───────────────────────────────────────────────────────

describe('useDeleteNotaFiscal', () => {
  it('calls NotaFiscalService.delete with id', async () => {
    const { NotaFiscalService } = await import('../../services/NotaFiscal');
    const { result } = renderHook(() => useDeleteNotaFiscal(), {
      wrapper: makeWrapper(),
    });

    result.current.mutate('nf-1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(NotaFiscalService.delete).toHaveBeenCalledWith('nf-1');
  });
});

// ── useNotasFiscaisPage ───────────────────────────────────────────────────────

describe('useNotasFiscaisPage', () => {
  it('exposes notas and pagination from list query', async () => {
    const { result } = renderHook(() => useNotasFiscaisPage(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.notas).toHaveLength(1);
    expect(result.current.pagination?.total).toBe(1);
  });

  it('resets page to 1 when search changes', async () => {
    const { result } = renderHook(() => useNotasFiscaisPage(), {
      wrapper: makeWrapper(),
    });

    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);

    act(() => result.current.setSearch('consulta'));
    expect(result.current.page).toBe(1);
  });

  it('resets page to 1 when status filter changes', async () => {
    const { result } = renderHook(() => useNotasFiscaisPage(), {
      wrapper: makeWrapper(),
    });

    act(() => result.current.setPage(2));
    act(() => result.current.setStatusFilter('EMITIDA'));
    expect(result.current.page).toBe(1);
  });

  it('openViewer sets viewerNF, closeViewer clears it', () => {
    const { result } = renderHook(() => useNotasFiscaisPage(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.viewerNF).toBeNull();
    act(() => result.current.openViewer(mockNF));
    expect(result.current.viewerNF?.id).toBe('nf-1');
    act(() => result.current.closeViewer());
    expect(result.current.viewerNF).toBeNull();
  });

  it('requestDelete / cancelDelete manage confirmDeleteId', () => {
    const { result } = renderHook(() => useNotasFiscaisPage(), {
      wrapper: makeWrapper(),
    });

    act(() => result.current.requestDelete('nf-1'));
    expect(result.current.confirmDeleteId).toBe('nf-1');
    act(() => result.current.cancelDelete());
    expect(result.current.confirmDeleteId).toBeNull();
  });

  it('requestEmitir / cancelEmitir manage confirmEmitirId', () => {
    const { result } = renderHook(() => useNotasFiscaisPage(), {
      wrapper: makeWrapper(),
    });

    act(() => result.current.requestEmitir('nf-2'));
    expect(result.current.confirmEmitirId).toBe('nf-2');
    act(() => result.current.cancelEmitir());
    expect(result.current.confirmEmitirId).toBeNull();
  });

  it('requestCancelar / cancelCancelar manage confirmCancelarId', () => {
    const { result } = renderHook(() => useNotasFiscaisPage(), {
      wrapper: makeWrapper(),
    });

    act(() => result.current.requestCancelar('nf-3'));
    expect(result.current.confirmCancelarId).toBe('nf-3');
    act(() => result.current.cancelCancelar());
    expect(result.current.confirmCancelarId).toBeNull();
  });

  it('modalOpen is initially false and can be set', () => {
    const { result } = renderHook(() => useNotasFiscaisPage(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.modalOpen).toBe(false);
    act(() => result.current.setModalOpen(true));
    expect(result.current.modalOpen).toBe(true);
  });
});
