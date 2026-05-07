import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotaFiscalService, type NotaFiscalFilters } from "../services/NotaFiscal";
import type { CreateNotaFiscalInput, NotaFiscalResponse } from "../types/api";

// ─── Query Keys ───────────────────────────────────────────────────────────────

const NF_KEYS = {
  all: ["nota-fiscal"] as const,
  list: (filters?: NotaFiscalFilters) => [...NF_KEYS.all, "list", filters] as const,
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type NFStatusFilter = "" | "PENDENTE" | "EMITIDA" | "CANCELADA";

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useNotasFiscaisPaginated(
  page: number,
  limit: number,
  search: string,
  status: NFStatusFilter,
) {
  return useQuery({
    queryKey: NF_KEYS.list({
      page,
      limit,
      search: search || undefined,
      status: status || undefined,
    }),
    queryFn: () =>
      NotaFiscalService.getAll({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
      }),
  });
}

export function useNotasFiscaisStats() {
  const emitidas = useQuery({
    queryKey: NF_KEYS.list({ status: "EMITIDA", limit: 500 }),
    queryFn: () => NotaFiscalService.getAll({ status: "EMITIDA", limit: 500 }),
  });
  const pendentes = useQuery({
    queryKey: NF_KEYS.list({ status: "PENDENTE", limit: 1 }),
    queryFn: () => NotaFiscalService.getAll({ status: "PENDENTE", limit: 1 }),
  });
  const canceladas = useQuery({
    queryKey: NF_KEYS.list({ status: "CANCELADA", limit: 1 }),
    queryFn: () => NotaFiscalService.getAll({ status: "CANCELADA", limit: 1 }),
  });

  const totalEmitidas = emitidas.data?.pagination.total ?? 0;
  const valorTotal = useMemo(
    () => (emitidas.data?.data ?? []).reduce((sum, nf) => sum + nf.valor, 0),
    [emitidas.data],
  );
 
  const totalPendentes = pendentes.data?.pagination.total ?? 0;
  const totalCanceladas = canceladas.data?.pagination.total ?? 0;

  return {
    totalEmitidas,
    valorTotal,
    totalPendentes,
    totalCanceladas,
    isLoading: emitidas.isLoading || pendentes.isLoading || canceladas.isLoading,
  };
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateNotaFiscal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNotaFiscalInput) => NotaFiscalService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: NF_KEYS.all }),
  });
}

export function useEmitirNotaFiscal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => NotaFiscalService.emitir(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: NF_KEYS.all }),
  });
}

export function useCancelarNotaFiscal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => NotaFiscalService.cancelar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: NF_KEYS.all }),
  });
}

export function useDeleteNotaFiscal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => NotaFiscalService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: NF_KEYS.all }),
  });
}

// ─── Page Hook ────────────────────────────────────────────────────────────────

export function useNotasFiscaisPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<NFStatusFilter>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmEmitirId, setConfirmEmitirId] = useState<string | null>(null);
  const [confirmCancelarId, setConfirmCancelarId] = useState<string | null>(null);
  const [viewerNF, setViewerNF] = useState<NotaFiscalResponse | null>(null);

  const listQuery = useNotasFiscaisPaginated(page, 10, search, statusFilter);
  const stats = useNotasFiscaisStats();
  const deleteNF = useDeleteNotaFiscal();
  const emitirNF = useEmitirNotaFiscal();
  const cancelarNF = useCancelarNotaFiscal();

  const notas = listQuery.data?.data ?? [];
  const pagination = listQuery.data?.pagination;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (s: NFStatusFilter) => {
    setStatusFilter(s);
    setPage(1);
  };

  return {
    notas,
    pagination,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    search,
    setSearch: handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusFilter,
    page,
    setPage,
    modalOpen,
    setModalOpen,
    stats,
    // Delete
    confirmDeleteId,
    requestDelete: (id: string) => setConfirmDeleteId(id),
    cancelDelete: () => setConfirmDeleteId(null),
    confirmDelete: () => {
      if (!confirmDeleteId) return;
      deleteNF.mutate(confirmDeleteId, { onSuccess: () => setConfirmDeleteId(null) });
    },
    isDeleting: deleteNF.isPending,
    // Emitir — abre o viewer com a NF retornada
    confirmEmitirId,
    requestEmitir: (id: string) => setConfirmEmitirId(id),
    cancelEmitir: () => setConfirmEmitirId(null),
    confirmEmitir: () => {
      if (!confirmEmitirId) return;
      emitirNF.mutate(confirmEmitirId, {
        onSuccess: (nf) => {
          setConfirmEmitirId(null);
          setViewerNF(nf);
        },
      });
    },
    isEmitindo: emitirNF.isPending,
    // Viewer da NF
    viewerNF,
    openViewer: (nf: NotaFiscalResponse) => setViewerNF(nf),
    closeViewer: () => setViewerNF(null),
    // Cancelar
    confirmCancelarId,
    requestCancelar: (id: string) => setConfirmCancelarId(id),
    cancelCancelar: () => setConfirmCancelarId(null),
    confirmCancelar: () => {
      if (!confirmCancelarId) return;
      cancelarNF.mutate(confirmCancelarId, { onSuccess: () => setConfirmCancelarId(null) });
    },
    isCancelando: cancelarNF.isPending,
  };
}
