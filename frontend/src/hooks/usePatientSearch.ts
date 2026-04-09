import { useState } from "react";
import { useDebounce } from "./useDebounce";
import { usePatientsPaginated } from "./usePatients";

export function usePatientSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);

  const { data, isLoading } = usePatientsPaginated(1, 20, debouncedQuery);

  const options = (data?.data ?? []).map((p) => ({ value: p.id, label: p.name }));

  return {
    query,
    setQuery,
    options,
    isLoading,
  };
}
