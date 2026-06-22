import type { ReactNode } from "react";
import logo from "../../../../../public/logo-adqpal.png";
import { MARKWATER } from "../../../../hooks/receituarioImages";

type PrintShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function PrintShell({ title, subtitle, children }: PrintShellProps) {
  return (
    <article className="relative mx-auto min-h-[297mm] w-[210mm] overflow-hidden bg-white px-[15mm] py-[12mm] text-[#111827] shadow-sm print:min-h-0 print:w-auto print:overflow-visible print:p-0 print:shadow-none">
      <img
        src={MARKWATER}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[42%] top-1/2 z-0 w-[75%] -translate-x-1/2 -translate-y-1/2 opacity-10 print:fixed"
      />

      <header className="relative z-10 mb-10 flex items-center justify-between border-b-4 border-[#2D3748] pb-4">
        <img src={logo} alt="ADQPAL" className="h-16 w-auto object-contain" />
        <div className="rounded-lg bg-gradient-to-r from-[#2D3748] to-[#38A169] px-6 py-3 text-right text-white">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">{title}</h2>
          <p className="mt-1 text-[10px] font-medium text-white/80">
            {subtitle ?? "ADQPAL - Sao Miguel dos Campos/AL"}
          </p>
        </div>
      </header>

      <main className="relative z-10 text-[13px] leading-8">{children}</main>

      <footer className="relative z-10 mt-12 text-center text-[10px] text-slate-500">
        Praca Dr. Jose Inacio, 173 - Centro - Sao Miguel dos Campos/AL - CNPJ 16.920.069/0001-73
      </footer>
    </article>
  );
}

export function SignatureBlock({ name, caption }: { name: string; caption?: string }) {
  return (
    <div className="mt-14 flex justify-center">
      <div className="w-72 text-center">
        <div className="border-t border-slate-700 pt-2 text-sm font-semibold">{name}</div>
        {caption && <div className="mt-1 text-[11px] text-slate-500">{caption}</div>}
      </div>
    </div>
  );
}
