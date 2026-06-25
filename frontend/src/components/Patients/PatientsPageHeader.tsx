import { Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { FilterDropdown, type FilterOption } from "./FilterDropdown";
import type { PatientFilter } from "../../hooks/usePatientsPage";
import { Header } from "../Dashboard/Header";

// Filtros extraídos do pen file — node Vd0Tk
const filterOptions: FilterOption[] = [
  { label: "Todos", value: "all" },
  { label: "Com CPF", value: "with_cpf" },
  { label: "Sem CPF", value: "without_cpf" },
  { label: "Com e-mail", value: "with_email" },
];

interface PatientsPageHeaderProps {
  total: number;
  search: string;
  onSearchChange: (v: string) => void;
  filter: PatientFilter;
  onFilterChange: (v: PatientFilter) => void;
}

export function PatientsPageHeader({
  total,
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: PatientsPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      {/* Linha 1 — Título + toggle (pen: okcg9, Wwtn2 fontSize 24, weight 600) */}
      <Header isSearchAvaliable={false} />
      <div className="flex flex-col items-stretch justify-between gap-4 mb-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* <MenuSidebar /> */}
            <Users size={20} className="text-[#38A169]" />
            <h1 className="text-2xl font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
              Pacientes
            </h1>
          </div>
          {/* pen: yb09a · fontSize 13 · #94A3B8 light · #64748B dark */}
          <p className="text-[13px] text-[#94A3B8] dark:text-[#64748B]">
            {total} paciente{total !== 1 ? "s" : ""} cadastrado
            {total !== 1 ? "s" : ""}
          </p>
        </div>

      </div>

      {/* Linha 2 — Toolbar (pen: zdLrO, gap 12, h:44) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {/* pen: AqIc8 */}
        <SearchBar value={search} onChange={onSearchChange} />

        {/* pen: Vd0Tk */}
        <FilterDropdown
          label="Cadastro"
          options={filterOptions}
          value={filter}
          onChange={(v) => onFilterChange(v as PatientFilter)}
        />

        {/* pen: r4nwu · bg #38a169, h:44, w:140 */}
        <button
          onClick={() => navigate("/pacientes/novo")}
          className="flex w-full items-center justify-center gap-2 h-11 px-5 bg-[#38A169] hover:bg-[#2F9259] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer sm:ml-auto sm:w-auto"
        >
          <UserPlus size={16} />
          Novo Paciente
        </button>
      </div>
    </div>
  );
}
