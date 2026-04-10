import { Calendar, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "../Dashboard/Header";
import { SearchBar } from "../Patients/SearchBar";
import { SearchableSelectGroup } from "../ui/SearchableSelect";

interface AgendaHeaderProps {
  totalHoje: number;
  search: string;
  onSearchChange: (v: string) => void;
  doctorOptions: { value: string; label: string }[];
  selectDoctor: string;
  setSelectDoctor: (v: string) => void;
}

export function AgendaHeader({
  totalHoje,
  search,
  onSearchChange,
  doctorOptions,
  selectDoctor,
  setSelectDoctor,
}: AgendaHeaderProps) {
  return (
    <div>
      {/* Linha 1 — Título + ações */}
      <Header isSearchAvaliable={false} />
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
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

      {/* Linha 2 — Busca */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Buscar consulta por paciente ou médico..."
        />

        <SearchableSelectGroup
          // label="Médico"
          // error={errors.doctorId?.message}
          placeholder="Buscar médico pelo nome..."
          className=" max-w-96 "
          classNameChildren="h-11 bg-white dark:bg-[#1E293B]"
          options={doctorOptions}
          value={selectDoctor}
          onChange={setSelectDoctor}
        />
      </div>
    </div>
  );
}
