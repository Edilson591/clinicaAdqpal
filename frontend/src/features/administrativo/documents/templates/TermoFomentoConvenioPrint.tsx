import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function TermoFomentoConvenioPrint({ getValue }: PrintTemplateProps) {
  const textoIntegral = getValue("textoIntegral");
  const titulo = getValue("titulo", "Termo de Fomento/Convenio");
  const parceiro = getValue("parceiro", "___________________");
  const objeto = getValue("objeto", "execucao de atividades institucionais da ADQPAL");
  const valor = getValue("valor", "___________________");
  const vigencia = getValue("vigencia", "___________________");
  const responsabilidades = getValue("responsabilidades", "As partes comprometem-se a cumprir o objeto pactuado, observando as normas legais, administrativas e financeiras aplicaveis.");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title={titulo} subtitle="ADQPAL - Convenios e Parcerias">
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        {titulo}
      </h1>
      <p className="text-justify">Pelo presente instrumento, a ADQPAL e <strong>{parceiro}</strong> ajustam o presente termo para {objeto}.</p>
      <div className="my-8 rounded-lg border border-slate-300 bg-white/80 p-5"><p><strong>Objeto:</strong> {objeto}</p><p><strong>Valor:</strong> {valor}</p><p><strong>Vigencia:</strong> {vigencia}</p></div>
      {textoIntegral && <p className="mb-8 whitespace-pre-line text-justify">{textoIntegral}</p>}
      <section><h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Responsabilidades</h2><p className="whitespace-pre-line text-justify">{responsabilidades}</p></section>
      <p className="mt-12 text-center">{data}</p>
      <div className="mt-14 grid grid-cols-2 gap-10">
        <SignatureBlock name="ADQPAL" caption="Entidade" />
        <SignatureBlock name={parceiro} caption="Parceiro/Convenente" />
      </div>
    </PrintShell>
  );
}
