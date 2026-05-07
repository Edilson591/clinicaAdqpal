import { useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, Stethoscope } from "lucide-react";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { FinanceiroHeader } from "../../components/Financeiro/FinanceiroHeader";
import { KPICard } from "../../components/Financeiro/KPICard";
import { ReceitaDespesasChart } from "../../components/Financeiro/ReceitaDespesasChart";
import { TransacoesRecentes } from "../../components/Financeiro/TransacoesRecentes";
import { Header } from "../../components/Dashboard/Header";
import { useTransactions, useDashboardFinance } from "../../hooks/useFinancial";
import { useSelectedMonth } from "../../components/Financeiro/useSelectedMonth";
import type { AxiosError } from "axios";
import { DefaultMainSection } from "../../components/ui/DefaltMainSection";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function GestaoFinanceiraPage() {
  const { selectedMonth } = useSelectedMonth();
  const monthDate = parseISO(`${selectedMonth}-01`);
  const dateStart = format(startOfMonth(monthDate), "yyyy-MM-dd");
  const dateEnd = format(endOfMonth(monthDate), "yyyy-MM-dd");

  const { data: txData, isLoading } = useTransactions({
    dateStart,
    dateEnd,
    limit: 100,
  });
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error,
  } = useDashboardFinance(selectedMonth);

  const transactions = useMemo(() => txData?.data ?? [], [txData]);

  const axiosError = error as AxiosError<{ message?: string }>;

  const {
    totalIncome,
    totalExpense,
    netBalance,
    paidAppointments,
    recentTransactions,
  } = useMemo(() => {
    const confirmed = transactions.filter((t) => t.status === "CONFIRMED");
    const income = confirmed
      .filter((t) => t.type === "INCOME")
      .reduce((s, t) => s + t.amount, 0);
    const expense = confirmed
      .filter((t) => t.type === "EXPENSE")
      .reduce((s, t) => s + t.amount, 0);
    const paid = confirmed.filter(
      (t) => t.type === "INCOME" && t.patientId,
    ).length;
    const recent = [...transactions]
      .sort(
        (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
      )
      .slice(0, 5);
    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
      paidAppointments: paid,
      recentTransactions: recent,
    };
  }, [transactions]);

  return (
    <DefaultMainSection>
      <div className="p-4 sm:p-8 flex flex-col gap-6 h-full">
        <Header isSearchAvaliable={false} />
        <FinanceiroHeader />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Receitas do Mês"
            value={isLoading ? "..." : formatCurrency(totalIncome)}
            trend="Transações confirmadas"
            trendPositive={true}
            Icon={TrendingUp}
            iconBg="#DCFCE7"
            iconColor="#38A169"
          />
          <KPICard
            title="Despesas do Mês"
            value={isLoading ? "..." : formatCurrency(totalExpense)}
            trend="Transações confirmadas"
            trendPositive={false}
            Icon={TrendingDown}
            iconBg="#FEE2E2"
            iconColor="#EF4444"
          />
          <KPICard
            title="Resultado Líquido"
            value={isLoading ? "..." : formatCurrency(netBalance)}
            trend={netBalance >= 0 ? "Saldo positivo" : "Saldo negativo"}
            trendPositive={netBalance >= 0}
            Icon={Wallet}
            iconBg="#DBEAFE"
            iconColor="#3B82F6"
          />
          <KPICard
            title="Consultas Pagas"
            value={isLoading ? "..." : String(paidAppointments)}
            trend="Vinculadas a pacientes"
            trendPositive={true}
            Icon={Stethoscope}
            iconBg="#F3E8FF"
            iconColor="#A855F7"
          />
        </div>

        {/* Bottom Row: Chart + Transactions */}
        <div className="flex flex-col lg:flex-row gap-4">
          <ReceitaDespesasChart
            data={dashboardData}
            isLoading={dashboardLoading}
            selectedMonth={selectedMonth}
          />
          <TransacoesRecentes
            transactions={recentTransactions}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            isLoading={isLoading}
          />
        </div>
        {axiosError && (
          <div className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 transition-colors">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {axiosError.message}
            </p>
          </div>
        )}
      </div>
    </DefaultMainSection>
  );
}
