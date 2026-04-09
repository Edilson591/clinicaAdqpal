import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }

  return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const btnBase =
    "w-9 h-9 flex items-center justify-center cursor-pointer rounded text-sm font-medium transition-colors border select-none";
  const btnActive =
    "bg-[#38A169] border-[#38A169] text-white";
  const btnInactive =
    "bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#2D3748] dark:text-[#F1F5F9] hover:bg-[#F0FFF4] dark:hover:bg-[#1A3A2A] hover:border-[#38A169] dark:hover:border-[#38A169]";
  const btnDisabled =
    "opacity-40 cursor-not-allowed bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#94A3B8]";

  return (
    <div className="flex items-center justify-center gap-1 flex-wrap py-2">
      {/* Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
        aria-label="Página anterior"
      >
        <ChevronLeft size={15} />
      </button>

      {/* Números */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-[#94A3B8] dark:text-[#475569] text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`${btnBase} ${p === currentPage ? btnActive : btnInactive}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}

      {/* Próxima */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
        aria-label="Próxima página"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}
