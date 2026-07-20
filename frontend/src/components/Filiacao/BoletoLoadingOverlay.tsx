import { FileCheck2, LoaderCircle } from "lucide-react";
import type { BoletoKind } from "../../types/boleto";

export function BoletoLoadingOverlay({ kind }: { kind: BoletoKind }) {
  const isCarnet = kind === "ANNUAL_CARNET";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Emitindo cobrança"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white p-7 text-center shadow-2xl dark:border-[#334155] dark:bg-[#1E293B] sm:p-9">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#E2E8F0] dark:bg-[#334155]">
          <div className="h-full w-2/3 animate-pulse rounded-r-full bg-gradient-to-r from-[#2F855A] to-[#68D391]" />
        </div>

        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E6F5ED] dark:bg-[#1A3A2A]">
          <FileCheck2 className="h-9 w-9 text-[#38A169]" />
          <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-[#38A169] dark:border-[#1E293B]">
            <LoaderCircle className="h-4 w-4 animate-spin text-white" />
          </span>
        </div>

        <h2 className="text-xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">
          {isCarnet ? "Gerando o carnê anual" : "Gerando o boleto"}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
          {isCarnet
            ? "Estamos registrando as 12 parcelas na Efí e preparando os respectivos PDFs."
            : "Estamos registrando a cobrança na Efí e preparando o PDF."}
        </p>

        {isCarnet && (
          <div className="mt-6 grid grid-cols-12 gap-1.5" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, index) => (
              <span
                key={index}
                className="h-1.5 animate-pulse rounded-full bg-[#38A169]"
                style={{ animationDelay: `${index * 90}ms` }}
              />
            ))}
          </div>
        )}

        <p className="mt-6 rounded-lg bg-[#F8FAFC] px-4 py-3 text-xs font-medium text-[#64748B] dark:bg-[#0F172A] dark:text-[#CBD5E1]">
          Não feche esta página. A operação pode levar alguns segundos.
        </p>
      </div>
    </div>
  );
}
