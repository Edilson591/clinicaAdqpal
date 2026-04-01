import { Menu, FileText, Plus, Search } from "lucide-react";
import { useSidebarContext } from "../../context/useSidebarContext";
import { Header } from "../Dashboard/Header";
import { useNavigate } from "react-router-dom";

interface ProntuariosHeaderProps {
  total: number;
  search: string;
  onSearchChange: (v: string) => void;
}

export function ProntuariosHeader({
  total,
  search,
  onSearchChange,
}: ProntuariosHeaderProps) {
  const { toggleMobile } = useSidebarContext();
  const navigate = useNavigate();
  return (
    <div>
      {/* Linha 1 — Título + ações */}
      <Header isSearchAvaliable={false} />
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={toggleMobile}
              className="lg:hidden cursor-pointer p-1 rounded text-[#94A3B8] dark:text-[#64748B] hover:opacity-70 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <FileText size={20} className="text-[#38A169]" />
            <h1 className="text-2xl font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
              Prontuários
            </h1>
          </div>
          <p className="text-[13px] text-[#94A3B8] dark:text-[#64748B]">
            {total} prontuário{total !== 1 ? "s" : ""} cadastrado
            {total !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Novo Prontuário */}
          <button 
          onClick={() => navigate('/prontuarios/novo')}
          className="flex items-center gap-2 h-11 px-5 bg-[#38A169] hover:bg-[#2F9259] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer">
            <Plus size={16} />
            Novo Prontuário
          </button>
        </div>
      </div>

      {/* Linha 2 — Search bar — pen: 2CiFa */}
      <div className="relative w-full max-w-sm">
        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8] dark:text-[#64748B]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar prontuário..."
          className="w-full h-11 pl-10 pr-4 rounded-lg text-sm border bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F1F5F9] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#38A169] focus:border-[#38A169] transition-colors"
        />
      </div>
    </div>
  );
}
