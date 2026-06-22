import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function ProjetoSedeAdqpalPrint({ getValue }: PrintTemplateProps) {
  const textoIntegral = getValue("textoIntegral");
  const titulo = getValue("titulo", "Projeto para Construcao da Sede da ADQPAL");
  const ano = getValue("ano", "2026");
  const valor = getValue("valor", "Emendas Parlamentares");
  const objetivo = getValue("objetivo", "Construir, reformar ou estruturar a sede institucional da ADQPAL.");
  const justificativa = getValue("justificativa", "Descreva a justificativa social, institucional e operacional do projeto.");
  const publico = getValue("publico", "Pacientes, familiares e comunidade atendida pela ADQPAL.");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Projeto da Sede ADQPAL" subtitle={`ADQPAL - ${ano}`}>
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">{titulo}</h1>
      <div className="mb-8 rounded-lg border border-slate-300 bg-white/80 p-5"><p><strong>Ano:</strong> {ano}</p><p><strong>Valor / Fonte:</strong> {valor}</p><p><strong>Publico alvo:</strong> {publico}</p></div>
      {textoIntegral && <p className="whitespace-pre-line text-justify">{textoIntegral}</p>}
      <section className="mt-6"><h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Objetivo</h2><p className="whitespace-pre-line text-justify">{objetivo}</p></section>
      <section className="mt-6"><h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Justificativa</h2><p className="whitespace-pre-line text-justify">{justificativa}</p></section>
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
