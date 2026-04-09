import { useState, useMemo } from "react";
import { usePatientsPaginated } from "./usePatients";

export type PatientFilter = "all" | "with_cpf" | "without_cpf" | "with_email";

export function usePatientsPage(page: number, setPage: (p: number) => void) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PatientFilter>("all");
  const { data, isLoading, error } = usePatientsPaginated(page, 20, search);
  const patients = useMemo(() => data?.data ?? [], [data]);

  const pagination = data?.pagination;


  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (value: PatientFilter) => {
    setFilter(value);
    setPage(1);
  };

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
    total: pagination?.total ?? 0,
    totalPages: pagination?.totalPages ?? 1,
    isLoading,
    error,
    search,
    setSearch: handleSearchChange,
    filter,
    setFilter: handleFilterChange,
  };
}
