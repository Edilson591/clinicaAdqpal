import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function AtaAssembleiaGeralPrint({ getValue }: PrintTemplateProps) {
  const titulo = getValue("titulo", "Ata da Assembleia Geral");
  const gestao = getValue("gestao", "2024/2028");
  const local = getValue("local", "Sede da ADQPAL");
  const dataAssembleia = getValue("dataAssembleia", "____ de __________ de ______");
  const pauta = getValue("pauta", "deliberacoes institucionais");
  const texto = getValue("texto", "Descreva aqui o conteudo da ata, deliberacoes, encaminhamentos e assinaturas registradas.");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title={titulo} subtitle={`Gestao ${gestao} - ${local}`}>
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">{titulo}</h1>
      <p className="text-justify">Aos {dataAssembleia}, em {local}, realizou-se assembleia geral da ADQPAL para tratar da pauta: <strong>{pauta}</strong>.</p>
      <section className="mt-8">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Registro da ata</h2>
        <p className="whitespace-pre-line text-justify">{texto}</p>
      </section>
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
