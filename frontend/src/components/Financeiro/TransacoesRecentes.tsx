import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TransactionResponse } from "../../types/api";

interface TransacoesRecentesProps {
  transactions: TransactionResponse[];
  totalIncome: number;
  totalExpense: number;
  isLoading?: boolean;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === yesterday.toDateString()) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function TransacaoIcon({ type }: { type: TransactionResponse["type"] }) {
  if (type === "INCOME") {
    return (
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#DCFCE7]">
        <ArrowDownLeft size={16} className="text-[#38A169]" />
      </div>
    );
  }
  if (type === "EXPENSE") {
    return (
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#FEE2E2]">
        <ArrowUpRight size={16} className="text-[#EF4444]" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#DBEAFE]">
      <ArrowLeftRight size={16} className="text-[#3B82F6]" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-[#E2E8F0] dark:bg-[#334155] shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="h-3 bg-[#E2E8F0] dark:bg-[#334155] rounded w-3/4" />
        <div className="h-2.5 bg-[#E2E8F0] dark:bg-[#334155] rounded w-1/3" />
      </div>
      <div className="h-3 bg-[#E2E8F0] dark:bg-[#334155] rounded w-16 shrink-0" />
    </div>
  );
}

export function TransacoesRecentes({
  transactions,
  totalIncome,
  totalExpense,
  isLoading = false,
}: TransacoesRecentesProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full lg:w-80 lg:min-w-[280px] bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] p-4 sm:p-5 flex flex-col gap-3 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
          Transações Recentes
        </h2>
        <button
          onClick={() => navigate("/financeiro/transacoes")}
          className="text-[12px] text-[#38A169] font-medium hover:underline cursor-pointer"
        >
          Ver todas
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : transactions.length === 0 ? (
          <p className="text-[12px] text-[#94A3B8] text-center py-4">
            Nenhuma transação neste período.
          </p>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="flex items-center gap-3">
              <TransacaoIcon type={t.type} />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[13px] font-medium text-[#1E293B] dark:text-[#F1F5F9] truncate">
                  {t.description}
                </span>
                <span className="text-[11px] text-[#94A3B8]">
                  {formatDate(t.dueDate)}
                  {t.category ? ` · ${t.category.name}` : ""}
                </span>
              </div>
              <span
                className="text-[13px] font-semibold shrink-0"
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
            </div>
          ))
        )}
      </div>

      <div className="border-t border-[#E2E8F0] dark:border-[#334155] pt-3 flex flex-col gap-1.5 mt-auto">
        <div className="flex flex-col gap-1 text-[12px] sm:flex-row sm:justify-between">
          <span className="text-[#64748B] dark:text-[#94A3B8]">Total entradas</span>
          <span className="font-semibold text-[#38A169]">{formatCurrency(totalIncome)}</span>
        </div>
        <div className="flex flex-col gap-1 text-[12px] sm:flex-row sm:justify-between">
          <span className="text-[#64748B] dark:text-[#94A3B8]">Total saídas</span>
          <span className="font-semibold text-[#EF4444]">{formatCurrency(totalExpense)}</span>
        </div>
      </div>
    </div>
  );
}
