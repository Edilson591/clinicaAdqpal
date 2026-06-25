import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Search,
  Plus,
  Trash2,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { Header } from "../../components/Dashboard/Header";
import { FinanceiroHeader } from "../../components/Financeiro/FinanceiroHeader";
import {
  useTransactions,
  useDeleteTransaction,
} from "../../hooks/useFinancial";
import type {
  TransactionResponse,
  TransactionType,
  TransactionStatus,
} from "../../types/api";
import { useSelectedMonth } from "../../components/Financeiro/useSelectedMonth";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// const TYPE_LABELS: Record<TransactionType, string> = {
//   INCOME: "Entrada",
//   EXPENSE: "Saída",
//   TRANSFER: "Transferência",
// };

const STATUS_LABELS: Record<TransactionStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
};

const STATUS_COLORS: Record<TransactionStatus, string> = {
  CONFIRMED: "bg-[#DCFCE7] text-[#166534]",
  PENDING: "bg-[#FEF9C3] text-[#854D0E]",
  CANCELLED: "bg-[#FEE2E2] text-[#991B1B]",
};

function TransactionTypeIcon({ type }: { type: TransactionType }) {
  if (type === "INCOME")
    return (
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#DCFCE7] shrink-0">
        <ArrowDownLeft size={15} className="text-[#38A169]" />
      </div>
    );
  if (type === "EXPENSE")
    return (
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FEE2E2] shrink-0">
        <ArrowUpRight size={15} className="text-[#EF4444]" />
      </div>
    );
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#DBEAFE] shrink-0">
      <ArrowLeftRight size={15} className="text-[#3B82F6]" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-[#E2E8F0] dark:bg-[#334155] shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 bg-[#E2E8F0] dark:bg-[#334155] rounded w-2/5" />
        <div className="h-2.5 bg-[#E2E8F0] dark:bg-[#334155] rounded w-1/4" />
      </div>
      <div className="h-3 bg-[#E2E8F0] dark:bg-[#334155] rounded w-20 shrink-0" />
    </div>
  );
}

interface TransactionRowProps {
  t: TransactionResponse;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  confirmId: string | null;
  onConfirmRequest: (id: string) => void;
  onConfirmCancel: () => void;
}

function TransactionRow({
  t,
  onDelete,
  isDeleting,
  confirmId,
  onConfirmRequest,
  onConfirmCancel,
}: TransactionRowProps) {
  const isConfirming = confirmId === t.id;

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 border-b border-[#F1F5F9] dark:border-[#1E293B] last:border-0 hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] transition-colors">
      <TransactionTypeIcon type={t.type} />

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1E293B] dark:text-[#F1F5F9] truncate">
          {t.description}
        </p>
        <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">
          {formatDate(t.dueDate)}
          {t.category ? ` · ${t.category.name}` : ""}
          {t.account ? ` · ${t.account.name}` : ""}
        </p>
      </div>

      {/* Status badge — hidden on mobile */}
      <span
        className={`hidden sm:inline-flex text-[11px] font-medium px-2.5 py-0.5 rounded-full ${STATUS_COLORS[t.status]}`}
      >
        {STATUS_LABELS[t.status]}
      </span>

      {/* Amount */}
      <span
        className="text-[14px] font-bold shrink-0 min-w-20 text-right"
        style={{
          color:
            t.type === "INCOME"
              ? "#38A169"
              : t.type === "EXPENSE"
                ? "#EF4444"
                : "#3B82F6",
        }}
      >
        {t.type === "INCOME" ? "+" : t.type === "EXPENSE" ? "-" : ""}
        {formatCurrency(t.amount)}
      </span>

      {/* Delete */}
      {isConfirming ? (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onDelete(t.id)}
            disabled={isDeleting}
            className="text-[11px] font-semibold text-white bg-[#EF4444] px-2.5 py-1 rounded-lg hover:bg-[#DC2626] transition-colors disabled:opacity-60 cursor-pointer"
          >
            Confirmar
          </button>
          <button
            onClick={onConfirmCancel}
            className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] px-2 py-1 rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#334155] transition-colors cursor-pointer"
          >
            Não
          </button>
        </div>
      ) : (
        <button
          onClick={() => onConfirmRequest(t.id)}
          className="shrink-0 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
          title="Deletar transação"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}

export default function TransacoesPage() {
  const navigate = useNavigate();
  const { selectedMonth } = useSelectedMonth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "">("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "">("");
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const monthDate = parseISO(`${selectedMonth}-01`);
  const dateStart = format(startOfMonth(monthDate), "yyyy-MM-dd");
  const dateEnd = format(endOfMonth(monthDate), "yyyy-MM-dd");

  const { data, isLoading } = useTransactions({
    search: search || undefined,
    type: typeFilter || undefined,
    status: statusFilter || undefined,
    dateStart,
    dateEnd,
    page,
    limit: 20,
  });

  const deleteTransaction = useDeleteTransaction();

  const transactions = data?.data ?? [];
  const pagination = data?.pagination;

  async function handleDelete(id: string) {
    await deleteTransaction.mutateAsync(id);
    setConfirmId(null);
  }

  return (
    <main className="flex-1 min-w-0 relative dark:bg-[#0F172A] overflow-y-auto">
      <div className="absolute inset-0 bg-[url('/bg-fundo.jpeg')] bg-no-repeat bg-cover bg-center opacity-10 z-[-1] dark:bg-none" />
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <Header isSearchAvaliable={false} />
        <FinanceiroHeader />

        {/* Filtros */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] p-4 flex flex-col lg:flex-row gap-3 transition-colors duration-200">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
            <input
              type="text"
              placeholder="Buscar por descrição..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full h-9.5 pl-8 pr-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[13px] text-[#1E293B] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38A169]/30"
            />
          </div>

          {/* Tipo */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#94A3B8]" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as TransactionType | "");
                setPage(1);
              }}
              className="h-9.5 min-w-0 flex-1 px-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[13px] text-[#475569] dark:text-[#CBD5E1] focus:outline-none cursor-pointer lg:flex-none"
            >
              <option value="">Todos os tipos</option>
              <option value="INCOME">Entradas</option>
              <option value="EXPENSE">Saídas</option>
              <option value="TRANSFER">Transferências</option>
            </select>
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as TransactionStatus | "");
              setPage(1);
            }}
            className="h-9.5 px-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[13px] text-[#475569] dark:text-[#CBD5E1] focus:outline-none cursor-pointer"
          >
            <option value="">Todos os status</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="PENDING">Pendente</option>
            <option value="CANCELLED">Cancelado</option>
          </select>

          {/* Nova transação */}
          <button
            onClick={() => navigate("/financeiro/nova")}
            className="flex items-center justify-center gap-2 h-9.5 px-3.5 rounded-lg bg-[#38A169] text-white text-[13px] font-semibold hover:bg-[#2F9259] transition-colors cursor-pointer shrink-0"
          >
            <Plus size={15} />
            Nova
          </button>
        </div>

        {/* Lista de transações */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] overflow-hidden transition-colors duration-200">
          {/* Cabeçalho da tabela */}
          <div className="hidden sm:grid grid-cols-[32px_1fr_120px_120px_60px] items-center gap-4 px-4 py-3 border-b border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A]">
            <div />
            <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
              Descrição
            </span>
            <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
              Status
            </span>
            <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide text-right">
              Valor
            </span>
            <div />
          </div>

          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <p className="text-[14px] text-[#94A3B8]">
                Nenhuma transação encontrada.
              </p>
              <button
                onClick={() => navigate("/financeiro/nova")}
                className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#38A169] text-white text-[13px] font-semibold hover:bg-[#2F9259] transition-colors cursor-pointer"
              >
                <Plus size={14} />
                Criar primeira transação
              </button>
            </div>
          ) : (
            transactions.map((t) => (
              <TransactionRow
                key={t.id}
                t={t}
                onDelete={handleDelete}
                isDeleting={deleteTransaction.isPending}
                confirmId={confirmId}
                onConfirmRequest={setConfirmId}
                onConfirmCancel={() => setConfirmId(null)}
              />
            ))
          )}
        </div>

        {/* Paginação */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[12px] text-[#94A3B8]">
              {pagination.total} transações · página {pagination.page} de{" "}
              {pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 px-3 rounded-lg border border-[#E2E8F0] dark:border-[#334155] text-[13px] text-[#475569] dark:text-[#CBD5E1] disabled:opacity-40 hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                Anterior
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="h-8 px-3 rounded-lg border border-[#E2E8F0] dark:border-[#334155] text-[13px] text-[#475569] dark:text-[#CBD5E1] disabled:opacity-40 hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
