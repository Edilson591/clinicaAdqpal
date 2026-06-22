import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { AdministrativeDocumentConfig, AdministrativeDocumentId } from "../documents/types";

type DocumentSidebarProps = {
  documents: AdministrativeDocumentConfig[];
  activeId: AdministrativeDocumentId;
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (id: AdministrativeDocumentId) => void;
};

export function DocumentSidebar({ documents, activeId, search, onSearchChange, onSelect }: DocumentSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const groups = documents.reduce<Record<string, AdministrativeDocumentConfig[]>>((acc, doc) => {
    acc[doc.group] = acc[doc.group] ? [...acc[doc.group], doc] : [doc];
    return acc;
  }, {});

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const activeButton = sidebar.querySelector<HTMLButtonElement>(`[data-document-id="${activeId}"]`);
    activeButton?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeId]);

  return (
    <aside ref={sidebarRef} className="h-fit max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1E293B] lg:sticky lg:top-6">
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#64748B] dark:text-[#94A3B8]">
        Buscar modelo
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Ex: recibo, atestado..."
          className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 text-sm text-[#1E293B] outline-none transition focus:border-[#38A169] focus:ring-1 focus:ring-[#38A169] dark:border-[#334155] dark:bg-[#263548] dark:text-[#F1F5F9]"
        />
      </div>

      <p className="mt-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
        {documents.length} modelos disponiveis nesta primeira etapa
      </p>

      <div className="mt-5 space-y-5">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#2D3748] dark:text-[#CBD5E1]">
              {group}
            </h3>
            <div className="space-y-1.5">
              {items.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  data-document-id={doc.id}
                  onClick={() => onSelect(doc.id)}
                  className={cn(
                    "w-full cursor-pointer rounded-lg px-3 py-2.5 text-left transition",
                    activeId === doc.id
                      ? "bg-[#E6F5ED] text-[#38A169] ring-1 ring-[#38A169]/20 dark:bg-[#1E3A2F]"
                      : "text-[#475569] hover:bg-[#F1F5F9] dark:text-[#CBD5E1] dark:hover:bg-[#263548]",
                  )}
                >
                  <span className="block text-sm font-semibold">{doc.title}</span>
                  <span className="mt-0.5 block text-xs text-[#94A3B8]">{doc.description}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
