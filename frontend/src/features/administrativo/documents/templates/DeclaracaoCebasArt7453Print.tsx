import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function DeclaracaoCebasArt7453Print({ getValue }: PrintTemplateProps) {
  const anoDecreto = getValue("anoDecreto", "2023");
  const inciso = getValue("inciso", "Inciso II");
  const requisitos = getValue("requisitos", "A entidade declara atender aos requisitos legais aplicaveis, mantendo escrituração regular, finalidade nao lucrativa e aplicacao integral de recursos em seus objetivos institucionais.");
  const observacoes = getValue("observacoes");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Declaracao CEBAS Art. 74/53" subtitle={`Decreto nº 11.791/${anoDecreto}`}>
      <h1 className="mb-10 text-center text-base font-bold uppercase tracking-[0.12em] text-[#2D3748]">
        Declaracao dos requisitos do Artigo 74, 53 - {inciso}
      </h1>
      <p className="whitespace-pre-line text-justify">{requisitos}</p>
      {observacoes && <p className="mt-6 whitespace-pre-line text-justify">{observacoes}</p>}
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
