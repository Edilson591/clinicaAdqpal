import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function OficioPrint({ getValue }: PrintTemplateProps) {
  const numero = getValue("numero", "____");
  const destinatario = getValue("destinatario", "___________________");
  const orgao = getValue("orgao", "");
  const assunto = getValue("assunto", "solicitacao administrativa");
  const corpo = getValue("corpo", "Descreva aqui o conteudo do oficio.");
  const contato = getValue("contato", "(82) 99163-6096");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Oficio">
      <div className="mb-10">
        <p className="font-semibold">Oficio nº {numero}</p>
        <p className="mt-6">{destinatario}</p>
        {orgao && <p>{orgao}</p>}
      </div>

      <p className="mb-6 font-semibold">Assunto: {assunto}</p>
      <p className="whitespace-pre-line text-justify">{corpo}</p>
      <p className="mt-8">Na oportunidade, colocamo-nos a disposicao para quaisquer esclarecimentos.</p>
      <p className="mt-10 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption={`Presidente - Contato/WhatsApp: ${contato}`} />
    </PrintShell>
  );
}
