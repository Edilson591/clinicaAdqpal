import { useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, Stethoscope } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { FinanceiroHeader } from "../../components/Financeiro/FinanceiroHeader";
import { KPICard } from "../../components/Financeiro/KPICard";
import { ReceitaDespesasChart } from "../../components/Financeiro/ReceitaDespesasChart";
import { TransacoesRecentes } from "../../components/Financeiro/TransacoesRecentes";
import { PluggyConnect } from "../../components/Financeiro/PluggyConnect";
import { Header } from "../../components/Dashboard/Header";
import { useTransactions } from "../../hooks/useFinancial";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function GestaoFinanceiraPage() {
  const now = new Date();
  const dateStart = format(startOfMonth(now), "yyyy-MM-dd");
  const dateEnd = format(endOfMonth(now), "yyyy-MM-dd");

  const { data: txData, isLoading } = useTransactions({ dateStart, dateEnd, limit: 100 });

  const transactions = txData?.data ?? [];

  const { totalIncome, totalExpense, netBalance, paidAppointments, recentTransactions } =
    useMemo(() => {
      const confirmed = transactions.filter((t) => t.status === "CONFIRMED");
      const income = confirmed
        .filter((t) => t.type === "INCOME")
        .reduce((s, t) => s + t.amount, 0);
      const expense = confirmed
        .filter((t) => t.type === "EXPENSE")
        .reduce((s, t) => s + t.amount, 0);
      const paid = confirmed.filter((t) => t.type === "INCOME" && t.patientId).length;
      const recent = [...transactions]
        .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
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
    <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
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
            currentIncome={totalIncome}
            currentExpense={totalExpense}
          />
          <TransacoesRecentes
            transactions={recentTransactions}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            isLoading={isLoading}
          />
        </div>

        {/* Open Banking */}
        <PluggyConnect />
      </div>
    </main>
  );
}
