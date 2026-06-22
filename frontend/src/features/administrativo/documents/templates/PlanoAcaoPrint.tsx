import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

function parseTable(text: string) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => line.split("|").map((cell) => cell.trim()));
}

export function PlanoAcaoPrint({ getValue }: PrintTemplateProps) {
  const titulo = getValue("titulo", "Plano de Acao Anual");
  const texto = getValue("texto", "Texto base do plano de acao.");
  const metas = parseTable(getValue("metas", "Meta | Indicador | Prazo"));
  const cronograma = parseTable(getValue("cronograma", "Atividade | Mes | Responsavel"));
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  const renderTable = (rows: string[][]) => (
    <table className="my-6 w-full border-collapse text-[10px]">
      <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border border-slate-300 p-2 align-top first:font-semibold">{cell}</td>)}</tr>)}</tbody>
    </table>
  );

  return (
    <PrintShell title={titulo} subtitle="ADQPAL - Plano de Acao">
      <h1 className="mb-8 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">{titulo}</h1>
      <div className="whitespace-pre-line text-justify text-[12px] leading-7">{texto}</div>
      <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Metas</h2>{renderTable(metas)}
      <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Cronograma</h2>{renderTable(cronograma)}
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
