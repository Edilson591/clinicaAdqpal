import { useState, useMemo } from "react";
import { ProntuariosHeader } from "../../components/Prontuarios/ProntuariosHeader";
import { ProntuariosList } from "../../components/Prontuarios/ProntuariosList";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";
import { usePatients } from "../../hooks/usePatients";

function ProntuariosContent() {
  const [search, setSearch] = useState("");
  const { data: records = [], isLoading } = useMedicalRecords();
  const { data: patients = [] } = usePatients();

  const patientMap = useMemo(
    () => new Map(patients.map((p) => [p.id, p.name])),
    [patients],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return records;
    return records.filter((r) => {
      const name = patientMap.get(r.patientId)?.toLowerCase() ?? "";
      const diag = (r.diagnosis ?? "").toLowerCase();
      return name.includes(q) || diag.includes(q);
    });
  }, [search, records, patientMap]);

  return (
    <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <ProntuariosHeader
          total={records.length}
          search={search}
          onSearchChange={setSearch}
        />

        {search && (
          <p className="text-xs text-[#94A3B8] dark:text-[#64748B] -mt-2">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para
            &ldquo;{search}&rdquo;
          </p>
        )}

        <ProntuariosList
          records={filtered}
          patientMap={patientMap}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}

export default function ProntuariosPage() {
  return <ProntuariosContent />;
}
