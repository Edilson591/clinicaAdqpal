import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function RequerimentoCebasPrint({ getValue }: PrintTemplateProps) {
  const cnpj = getValue("cnpj", "16.920.069/0001-73");
  const certificacao = getValue("certificacao", "CEBAS Saude e Assistencia Social");
  const destinatario = getValue("destinatario", "Ministerio competente");
  const fundamentacao = getValue("fundamentacao", "Descreva as atividades e fundamentos que justificam o pedido.");
  const observacoes = getValue("observacoes");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Requerimento CEBAS" subtitle="Certificacao de Entidade Beneficente">
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        Requerimento CEBAS
      </h1>
      <p className="text-justify">
        A <strong>ADQPAL - Associacao dos Dependentes Quimicos e Portadores de Doencas Psiquiatricas de Sao Miguel dos Campos/AL</strong>, inscrita no CNPJ nº <strong>{cnpj}</strong>, vem respeitosamente perante <strong>{destinatario}</strong> requerer a concessao/renovacao da certificacao <strong>{certificacao}</strong>.
      </p>
      <section className="mt-8">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Fundamentacao e atividades desenvolvidas</h2>
        <p className="whitespace-pre-line text-justify">{fundamentacao}</p>
      </section>
      {observacoes && (
        <section className="mt-8">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Informacoes adicionais</h2>
          <p className="whitespace-pre-line text-justify">{observacoes}</p>
        </section>
      )}
      <p className="mt-8">Nestes termos, pede deferimento.</p>
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
