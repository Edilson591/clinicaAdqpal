import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function RequerimentoPrint({ getValue }: PrintTemplateProps) {
  const textoIntegral = getValue("textoIntegral");
  const requerente = getValue("requerente", "ADQPAL");
  const destinatario = getValue("destinatario", "A quem possa interessar");
  const assunto = getValue("assunto", "solicitacao administrativa");
  const fundamentacao = getValue("fundamentacao", "Descreva a fundamentacao do requerimento.");
  const pedido = getValue("pedido", "Pede deferimento.");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Requerimento">
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        Requerimento
      </h1>
      <p className="mb-8 font-semibold">Ao(À) {destinatario}</p>
      <p className="text-justify"><strong>{requerente}</strong>, vem respeitosamente requerer <strong>{assunto}</strong>, pelos motivos e fundamentos a seguir expostos.</p>
      {textoIntegral && <p className="mt-8 whitespace-pre-line text-justify">{textoIntegral}</p>}
      <section className="mt-8"><h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Fundamentacao</h2><p className="whitespace-pre-line text-justify">{fundamentacao}</p></section>
      <section className="mt-8"><h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Pedido</h2><p className="whitespace-pre-line text-justify">{pedido}</p></section>
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
