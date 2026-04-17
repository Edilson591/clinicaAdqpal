import { useState, useMemo } from "react";
import { ProntuariosHeader } from "../../components/Prontuarios/ProntuariosHeader";
import { ProntuariosList } from "../../components/Prontuarios/ProntuariosList";
import { Pagination } from "../../components/ui/Pagination";
import { useMedicalRecordsPaginated } from "../../hooks/useMedicalRecords";

function ProntuariosContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useMedicalRecordsPaginated(page, 20, search);
  // const records = useMemo(() => data?.data ?? [], [data]);
  const pagination = data?.pagination;
  const prontuarios = useMemo(() => data?.data ?? [], [data]);

  // const filtered = useMemo(() => {
  //   const q = search.toLowerCase().trim();
  //   if (!q) return records;
  //   return records.filter((r) => {
  //     const name = r.patient.name.toLowerCase();
  //     const diag = (r.diagnosis ?? "").toLowerCase();
  //     return name.includes(q) || diag.includes(q);
  //   });
  // }, [search, records]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <ProntuariosHeader
          total={pagination?.total ?? 0}
          search={search}
          onSearchChange={handleSearchChange}
        />

        {search && (
          <p className="text-xs text-[#94A3B8] dark:text-[#64748B] -mt-2">
            {prontuarios.length} resultado{prontuarios.length !== 1 ? "s" : ""} para
            &ldquo;{search}&rdquo;
          </p>
        )}

        <ProntuariosList records={prontuarios} isLoading={isLoading} />

        <Pagination
          currentPage={page}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>
    </main>
  );
}

export default function ProntuariosPage() {
  return <ProntuariosContent />;
}
