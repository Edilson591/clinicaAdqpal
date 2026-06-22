import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function AtestadoMedicoPrint({ getValue }: PrintTemplateProps) {
  const nome = getValue("nome", "___________________").toUpperCase();
  const rg = getValue("rg", "___________________");
  const cpf = getValue("cpf", "___________________");
  const dias = getValue("dias", "____").toUpperCase();
  const inicio = getValue("inicio", "____/____/______");
  const cid = getValue("cid");
  const medico = getValue("medico", "Medico responsavel");
  const crm = getValue("crm", "CRM/AL ______");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Atestado Medico" subtitle="ADQPAL - Atendimento de Saude">
      <h1 className="mb-12 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        Atestado Medico
      </h1>
      <p className="text-justify">
        Atesto, para os devidos fins, que o(a) Sr(a). <strong>{nome}</strong>, RG nº {rg}, CPF nº {cpf}, foi atendido(a) nesta instituicao de saude e devera permanecer afastado(a) de suas atividades por <strong>{dias}</strong>, a partir de {inicio}.
      </p>
      {cid && <p className="mt-6">CID: <strong>{cid}</strong></p>}
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name={`Dr(a). ${medico}`} caption={crm} />
    </PrintShell>
  );
}
