import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Stethoscope,
} from "lucide-react";
import { FinanceiroHeader } from "../../components/Financeiro/FinanceiroHeader";
import { KPICard } from "../../components/Financeiro/KPICard";
import { ReceitaDespesasChart } from "../../components/Financeiro/ReceitaDespesasChart";
import { TransacoesRecentes } from "../../components/Financeiro/TransacoesRecentes";
import { Header } from "../../components/Dashboard/Header";

export default function GestaoFinanceiraPage() {
  return (
    <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
      <div className="p-4 sm:p-8 flex flex-col gap-6 h-full">
        <Header isSearchAvaliable={false} />
        <FinanceiroHeader />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Receita Total"
            value="R$ 24.850"
            trend="↑ 12% vs mês anterior"
            trendPositive={true}
            Icon={TrendingUp}
            iconBg="#DCFCE7"
            iconColor="#38A169"
          />
          <KPICard
            title="Despesas"
            value="R$ 8.320"
            trend="↑ 3% vs mês anterior"
            trendPositive={false}
            Icon={TrendingDown}
            iconBg="#FEE2E2"
            iconColor="#EF4444"
          />
          <KPICard
            title="Saldo Líquido"
            value="R$ 16.530"
            trend="↑ 18% vs mês anterior"
            trendPositive={true}
            Icon={Wallet}
            iconBg="#DBEAFE"
            iconColor="#3B82F6"
          />
          <KPICard
            title="Consultas Pagas"
            value="47"
            trend="de 52 consultas"
            trendPositive={true}
            Icon={Stethoscope}
            iconBg="#F3E8FF"
            iconColor="#A855F7"
          />
        </div>

        {/* Bottom Row: Chart + Transactions */}
        <div className="flex flex-col lg:flex-row gap-4">
          <ReceitaDespesasChart />
          <TransacoesRecentes />
        </div>
      </div>
    </main>
  );
}
