import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function DeclaracaoDesligamentoPrint({ getValue }: PrintTemplateProps) {
  const textoIntegral = getValue("textoIntegral");
  const nome = getValue("nome", "___________________");
  const cpf = getValue("cpf", "___________________");
  const motivo = getValue("motivo", "por solicitacao do(a) interessado(a)");
  const dataDesligamento = getValue("dataDesligamento", "____/____/______");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Declaracao de Desligamento">
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        Declaracao de Desligamento
      </h1>
      <p className="text-justify">
        A ADQPAL - Associacao dos Dependentes Quimicos e Portadores de Doencas Psiquiatricas de Sao Miguel dos Campos/AL declara, para os devidos fins, que <strong>{nome}</strong>, CPF nº <strong>{cpf}</strong>, encontra-se desligado(a) dos registros e atividades desta instituicao a partir de <strong>{dataDesligamento}</strong>.
      </p>
      {textoIntegral ? (
        <p className="mt-6 whitespace-pre-line text-justify">{textoIntegral}</p>
      ) : (
        <p className="mt-6 text-justify">Esta declaracao e emitida para que produza os efeitos administrativos necessarios.</p>
      )}
      <p className="mt-6 text-justify">O presente desligamento ocorreu {motivo}.</p>
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
