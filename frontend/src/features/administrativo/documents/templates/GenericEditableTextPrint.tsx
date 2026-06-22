import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function GenericEditableTextPrint({ getValue }: PrintTemplateProps) {
  const titulo = getValue("titulo", "Documento Administrativo");
  const subtitulo = getValue("subtitulo", "ADQPAL - Documento editavel");
  const texto = getValue("texto", "Edite o texto integral deste documento.");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");
  const incluirAssinatura = getValue("assinatura", "sim").toLowerCase() !== "nao";

  return (
    <PrintShell title={titulo} subtitle={subtitulo}>
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">{titulo}</h1>
      <div className="whitespace-pre-line text-justify text-[12.5px] leading-7">{texto}</div>
      <p className="mt-12 text-center">{data}</p>
      {incluirAssinatura && <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />}
    </PrintShell>
  );
}
