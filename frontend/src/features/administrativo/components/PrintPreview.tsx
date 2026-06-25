import type { RefObject } from "react";
import type { AdministrativeDocumentConfig, AdministrativeValues } from "../documents/types";

type PrintPreviewProps = {
  document: AdministrativeDocumentConfig;
  values: AdministrativeValues;
  contentRef?: RefObject<HTMLDivElement | null>;
};

export function PrintPreview({ document, values, contentRef }: PrintPreviewProps) {
  const Template = document.Template;
  const getValue = (name: string, fallback = "") => {
    const fieldDefault = document.fields.find((field) => field.name === name)?.defaultValue;
    return values[name]?.trim() || fieldDefault?.trim() || fallback;
  };

  return (
    <section className="min-w-0 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1E293B] sm:p-6 print:border-0 print:bg-white print:p-0 print:shadow-none">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-lg font-bold text-[#1E293B] dark:text-[#F1F5F9]">Pre-visualizacao</h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Renderizada com componentes React, sem HTML digitado pelo usuario.</p>
        </div>
      </div>
      <div className="max-h-[calc(100dvh-14rem)] overflow-auto rounded-lg bg-[#F8FAFC] p-4 dark:bg-[#0F172A] print:max-h-none print:overflow-visible print:bg-white print:p-0">
        <div ref={contentRef} className="min-w-max lg:min-w-0">
          <Template values={values} getValue={getValue} />
        </div>
      </div>
    </section>
  );
}
