import { PatientsPageHeader } from "../../components/Patients/PatientsPageHeader";
import { PatientList } from "../../components/Patients/PatientList";
import { usePatientsPage } from "../../hooks/usePatientsPage";

function PatientsContent() {
  const { patients, total, isLoading, search, setSearch, filter, setFilter } =
    usePatientsPage();

  return (
    // pen: Km2zu · bg #F8FAFC light · #0F172A dark · padding 32 · gap 24
    <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header — pen: 0XXGm */}
        <PatientsPageHeader
          total={total}
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={setFilter}
        />

        {/* Resultado da busca */}
        {search && (
          <p className="text-xs text-[#94A3B8] dark:text-[#64748B] -mt-4">
            {patients.length} resultado{patients.length !== 1 ? "s" : ""} para
            &ldquo;{search}&rdquo;
          </p>
        )}

        {/* Lista — pen: jBwnl */}
        <PatientList patients={patients} isLoading={isLoading} />
      </div>
    </main>
  );
}

export default function PatientsPage() {
  return <PatientsContent />;
}
