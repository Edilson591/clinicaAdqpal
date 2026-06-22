import type { PrintTemplateProps } from "../types";
import { PrintShell } from "./PrintShell";

const FIRST_PAGE_BASE_ROWS = 18;
const CONTINUATION_PAGE_ROWS = 21;

function splitRows(totalRows: number, firstPageRows: number) {
  const pages: number[][] = [];
  let nextRow = 1;

  while (nextRow <= totalRows) {
    const rowsInPage = pages.length === 0 ? firstPageRows : CONTINUATION_PAGE_ROWS;
    const pageRows = Array.from(
      { length: Math.min(rowsInPage, totalRows - nextRow + 1) },
      (_, index) => nextRow + index,
    );
    pages.push(pageRows);
    nextRow += pageRows.length;
  }

  return pages;
}

function PresenceTable({ rows }: { rows: number[] }) {
  return (
    <table className="w-full table-fixed border-collapse text-[11px] leading-tight">
      <thead>
        <tr className="bg-[#2D3748] text-white">
          <th className="w-10 border border-[#2D3748] p-2 text-left">#</th>
          <th className="border border-[#2D3748] p-2 text-left">Nome completo</th>
          <th className="w-32 border border-[#2D3748] p-2 text-left">CPF / RG</th>
          <th className="w-48 border border-[#2D3748] p-2 text-left">Assinatura</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((rowNumber) => (
          <tr key={rowNumber} className="break-inside-avoid page-break-inside-avoid">
            <td className="h-8 border border-slate-300 p-2 text-center">{rowNumber}</td>
            <td className="border border-slate-300 p-2" />
            <td className="border border-slate-300 p-2" />
            <td className="border border-slate-300 p-2" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ListaPresencaAgePrint({ getValue }: PrintTemplateProps) {
  const numero = getValue("numero", "____");
  const dataAssembleia = getValue("dataAssembleia", "____ de __________ de ______");
  const horario = getValue("horario", "____h____");
  const local = getValue("local", "Sede da ADQPAL");
  const pauta = getValue("pauta", "Assembleia Geral Extraordinaria");
  const linhas = Math.max(5, Math.min(Number(getValue("linhas", "20")) || 20, 200));
  const pautaExtraRows = Math.floor(pauta.length / 120);
  const firstPageRows = Math.max(8, FIRST_PAGE_BASE_ROWS - pautaExtraRows);
  const pages = splitRows(linhas, firstPageRows);

  return (
    <>
      {pages.map((rows, pageIndex) => (
        <div key={pageIndex} className={pageIndex > 0 ? "print-page-start" : undefined}>
          <PrintShell title="Lista de Presenca AGE" subtitle="Assembleia Geral Extraordinaria - ADQPAL">
            <h1 className="mb-8 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
              Lista de Presenca{pageIndex > 0 ? " - Continuacao" : ""}
            </h1>
            {pageIndex === 0 ? (
              <div className="mb-6 rounded-lg border border-slate-300 bg-white/80 p-4 text-sm leading-6">
                <p><strong>AGE nº:</strong> {numero}</p>
                <p><strong>Data:</strong> {dataAssembleia} - <strong>Horario:</strong> {horario}</p>
                <p><strong>Local:</strong> {local}</p>
                <p><strong>Pauta:</strong> {pauta}</p>
              </div>
            ) : (
              <div className="mb-6 rounded-lg border border-slate-300 bg-white/80 p-3 text-xs leading-5">
                <p><strong>AGE nº:</strong> {numero} - <strong>Data:</strong> {dataAssembleia}</p>
              </div>
            )}
            <PresenceTable rows={rows} />
          </PrintShell>
        </div>
      ))}
    </>
  );
}
