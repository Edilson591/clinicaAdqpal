import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function ReciboPrint({ getValue }: PrintTemplateProps) {
  const favorecido = getValue("favorecido", "___________________");
  const pagador = getValue("pagador", "___________________");
  const cpf = getValue("cpf", "___________________");
  const valor = getValue("valor", "0,00");
  const referente = getValue("referente", "servicos prestados");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Recibo">
      <div className="mb-12 flex items-start justify-between gap-8">
        <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-[#2D3748]">Recibo</h1>
        <div className="rounded-lg border-2 border-[#2D3748] px-6 py-3 text-lg font-bold">R$ {valor}</div>
      </div>
      <p>Recebi de <strong>{pagador}</strong>, CPF nº {cpf}, a importancia de <strong>R$ {valor}</strong>.</p>
      <p className="mt-6">Referente a {referente}.</p>
      <p className="mt-6">Favorecido: <strong>{favorecido}</strong>.</p>
      <p className="mt-12">{data}</p>
      <SignatureBlock name={favorecido} caption="Assinatura" />
    </PrintShell>
  );
}
