import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function EstatutoAdqpalPrint({ getValue }: PrintTemplateProps) {
  const titulo = getValue("titulo", "Estatuto Social");
  const associacao = getValue("associacao", "Associacao dos Dependentes Quimicos e Portadores de Doencas Psiquiatricas de Sao Miguel dos Campos");
  const sigla = getValue("sigla", "ADQPAL");
  const cnpj = getValue("cnpj", "16.920.069/0001-73");
  const endereco = getValue("endereco", "Praca Dr. Jose Inacio nº 173, Centro, Sao Miguel dos Campos/AL");
  const texto = getValue("texto", "Insira aqui o texto integral ou os artigos principais do estatuto.");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title={titulo} subtitle={`${sigla} - ${cnpj}`}>
      <h1 className="mb-4 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        {titulo}
      </h1>
      <div className="mb-8 text-center text-[11px] text-slate-600">
        <p className="font-semibold uppercase">{associacao} - {sigla}</p>
        <p>CNPJ nº {cnpj} - {endereco}</p>
      </div>
      <div className="space-y-4 whitespace-pre-line text-justify text-[12px] leading-7">
        {texto}
      </div>
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption={`Presidente / ${sigla}`} />
    </PrintShell>
  );
}
