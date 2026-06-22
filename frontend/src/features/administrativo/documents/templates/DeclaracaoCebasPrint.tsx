import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function DeclaracaoCebasPrint({ getValue }: PrintTemplateProps) {
  const textoIntegral = getValue("textoIntegral");
  const titulo = getValue("titulo", "Declaracao CEBAS");
  const ano = getValue("ano", "2025");
  const atividades = getValue("atividades", "Descreva as atividades gratuitas, beneficentes e socioassistenciais desenvolvidas.");
  const declaracao = getValue("declaracao", "Declaramos, para os devidos fins, que a entidade desenvolve suas atividades institucionais sem finalidade lucrativa e em conformidade com suas finalidades estatutarias.");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title={titulo} subtitle="ADQPAL - Certificacao CEBAS">
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">{titulo}</h1>
      <p className="text-justify">{declaracao}</p>
      {textoIntegral && <p className="mt-8 whitespace-pre-line text-justify">{textoIntegral}</p>}
      <section className="mt-8"><h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Atividades no exercicio de {ano}</h2><p className="whitespace-pre-line text-justify">{atividades}</p></section>
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
