import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

type TipoTransacao = "entrada" | "saida";

interface Transacao {
  nome: string;
  data: string;
  valor: string;
  tipo: TipoTransacao;
}

const transacoes: Transacao[] = [
  { nome: "Consulta Ana Lima", data: "Hoje 10:30", valor: "+R$350", tipo: "entrada" },
  { nome: "Aluguel consultório", data: "Hoje 09:00", valor: "-R$1.800", tipo: "saida" },
  { nome: "Consulta Pedro Costa", data: "Ontem 15:00", valor: "+R$350", tipo: "entrada" },
  { nome: "Material clínico", data: "Ontem 14:20", valor: "-R$420", tipo: "saida" },
  { nome: "Consulta Maria Silva", data: "28/03 11:00", valor: "+R$350", tipo: "entrada" },
];

function TransacaoIcon({ tipo }: { tipo: TipoTransacao }) {
  const isEntrada = tipo === "entrada";
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
      style={{ backgroundColor: isEntrada ? "#DCFCE7" : "#FEE2E2" }}
    >
      {isEntrada ? (
        <ArrowDownLeft size={16} className="text-[#38A169]" />
      ) : (
        <ArrowUpRight size={16} className="text-[#EF4444]" />
      )}
    </div>
  );
}

export function TransacoesRecentes() {
  return (
    <div
      className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-[#334155] p-5 flex flex-col gap-3 transition-colors duration-200"
      style={{ width: 320, minWidth: 280 }}
    >
      <h2 className="text-[15px] font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
        Transações Recentes
      </h2>

      <div className="flex flex-col gap-3">
        {transacoes.map((t, i) => (
          <div key={i} className="flex items-center gap-3">
            <TransacaoIcon tipo={t.tipo} />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[13px] font-medium text-[#1E293B] dark:text-[#F1F5F9] truncate">
                {t.nome}
              </span>
              <span className="text-[11px] text-[#94A3B8]">{t.data}</span>
            </div>
            <span
              className="text-[13px] font-semibold shrink-0"
              style={{ color: t.tipo === "entrada" ? "#38A169" : "#EF4444" }}
            >
              {t.valor}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E2E8F0] dark:border-[#334155] pt-3 flex flex-col gap-1.5 mt-auto">
        <div className="flex justify-between text-[12px]">
          <span className="text-[#64748B] dark:text-[#94A3B8]">Total entradas</span>
          <span className="font-semibold text-[#38A169]">R$ 24.850</span>
        </div>
        <div className="flex justify-between text-[12px]">
          <span className="text-[#64748B] dark:text-[#94A3B8]">Total saídas</span>
          <span className="font-semibold text-[#EF4444]">R$ 8.320</span>
        </div>
      </div>
    </div>
  );
}
