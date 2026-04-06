import { Calendar, Plus } from "lucide-react";
import { Link } from "react-router-dom";
// import { useSidebarContext } from "../../context/useSidebarContext";
import { Header } from "../Dashboard/Header";

interface AgendaHeaderProps {
  totalHoje: number;
}

export function AgendaHeader({ totalHoje }: AgendaHeaderProps) {
  // const { toggleMobile } = useSidebarContext();

  return (
    <div>
      {/* Linha 1 — Título + ações */}
      <Header isSearchAvaliable={false} />
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* <button
              onClick={toggleMobile}
              className="lg:hidden cursor-pointer p-1 rounded text-[#94A3B8] dark:text-[#64748B] hover:opacity-70 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button> */}
            <Calendar size={20} className="text-[#38A169]" />
            <h1 className="text-2xl font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
              Agenda
            </h1>
          </div>
          <p className="text-[13px] text-[#94A3B8] dark:text-[#64748B]">
            {totalHoje} consulta{totalHoje !== 1 ? "s" : ""} hoje
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle dark/light */}
      

          {/* Nova Consulta — pen: v27Cr · bg #38A169, h:44, w:180 */}
          <Link
            to="/agenda/nova"
            className="flex items-center gap-2 h-11 px-5 bg-[#38A169] hover:bg-[#2F9259] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus size={16} />
            Nova Consulta
          </Link>
        </div>
      </div>
    </div>
  );
}
