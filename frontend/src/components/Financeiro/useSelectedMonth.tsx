import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";

export function useSelectedMonth() {
  const [params, setParams] = useSearchParams();
  const currentMonthValue = format(new Date(), "yyyy-MM");
  const selectedMonth = params.get("month") ?? currentMonthValue;

  function setMonth(value: string) {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("month", value);
      return next;
    });
  }

  return { selectedMonth, setMonth };
}
