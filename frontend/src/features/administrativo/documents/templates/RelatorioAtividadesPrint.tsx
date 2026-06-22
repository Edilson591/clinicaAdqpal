import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function RelatorioAtividadesPrint({ getValue }: PrintTemplateProps) {
  const textoIntegral = getValue("textoIntegral");
  const titulo = getValue("titulo", "Relatorio de Atividades");
  const ano = getValue("ano", "2025");
  const atendimentos = getValue("atendimentos", "Nao informado");
  const resumo = getValue("resumo", "Descreva o resumo das atividades desenvolvidas pela instituicao.");
  const resultados = getValue("resultados", "Descreva os resultados alcancados e impactos sociais.");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title={titulo} subtitle={`ADQPAL - Ano ${ano}`}>
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">{titulo}</h1>
      <div className="mb-8 rounded-lg border border-slate-300 bg-white/80 p-5"><p><strong>Ano:</strong> {ano}</p><p><strong>Atendimentos / beneficiarios:</strong> {atendimentos}</p></div>
      {textoIntegral && <p className="whitespace-pre-line text-justify">{textoIntegral}</p>}
      <section className="mt-6"><h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Resumo das atividades</h2><p className="whitespace-pre-line text-justify">{resumo}</p></section>
      <section className="mt-6"><h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Resultados</h2><p className="whitespace-pre-line text-justify">{resultados}</p></section>
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
