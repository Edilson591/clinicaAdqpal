import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

function parseRows(text: string) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [descricao = "", valor = ""] = line.split("|").map((part) => part.trim());
    return { descricao, valor };
  });
}

export function FinancialEditablePrint({ getValue }: PrintTemplateProps) {
  const titulo = getValue("titulo", "Documento Financeiro");
  const periodo = getValue("periodo", "Periodo nao informado");
  const intro = getValue("intro");
  const linhas = parseRows(getValue("linhas", "Descricao | Valor"));
  const reconhecimento = getValue("reconhecimento");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title={titulo} subtitle="ADQPAL - Financeiro e Contabil">
      <h1 className="mb-3 text-center text-lg font-bold uppercase tracking-[0.14em] text-[#2D3748]">{titulo}</h1>
      <p className="mb-8 text-center text-sm font-semibold text-slate-600">{periodo}</p>
      {intro && <p className="mb-6 whitespace-pre-line text-justify">{intro}</p>}
      <table className="w-full border-collapse text-[11px]">
        <thead><tr className="bg-[#2D3748] text-white"><th className="border border-[#2D3748] p-2 text-left">Descricao</th><th className="border border-[#2D3748] p-2 text-right">Valor</th></tr></thead>
        <tbody>{linhas.map((row, index) => <tr key={`${row.descricao}-${index}`}><td className="border border-slate-300 p-2">{row.descricao}</td><td className="border border-slate-300 p-2 text-right font-semibold">{row.valor}</td></tr>)}</tbody>
      </table>
      {reconhecimento && <p className="mt-8 whitespace-pre-line text-justify">{reconhecimento}</p>}
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
