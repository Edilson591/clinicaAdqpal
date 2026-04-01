import { useState, useMemo } from "react";
import { usePatients } from "./usePatients";

export type PatientFilter = "all" | "with_cpf" | "without_cpf" | "with_email";

export function usePatientsPage() {
  const { data: patients = [], isLoading, error } = usePatients();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PatientFilter>("all");

  const filtered = useMemo(() => {
    let result = patients;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.cpf && p.cpf.includes(q)) ||
          (p.email && p.email.toLowerCase().includes(q)),
      );
    }

    switch (filter) {
      case "with_cpf":
        result = result.filter((p) => p.cpf);
        break;
      case "without_cpf":
        result = result.filter((p) => !p.cpf);
        break;
      case "with_email":
        result = result.filter((p) => p.email);
        break;
    }

    return result;
  }, [patients, search, filter]);

  return {
    patients: filtered,
    total: patients.length,
    isLoading,
    error,
    search,
    setSearch,
    filter,
    setFilter,
  };
}
