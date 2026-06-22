import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function TermoVoluntarioPrint({ getValue }: PrintTemplateProps) {
  const nome = getValue("nome", "___________________");
  const cpf = getValue("cpf", "___________________");
  const estadoCivil = getValue("estadoCivil", "___________________");
  const profissao = getValue("profissao", "___________________");
  const endereco = getValue("endereco", "___________________");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Declaracao do Voluntario">
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        Declaracao do Voluntario
      </h1>
      <p className="text-justify">
        Eu, <strong>{nome}</strong>, CPF nº <strong>{cpf}</strong>, {estadoCivil}, {profissao}, residente em {endereco}, declaro para os devidos fins que sou voluntario(a) nas atividades desenvolvidas por esta instituicao.
      </p>
      <p className="mt-6 text-justify">
        Declaro ter conhecimento de que os servicos voluntarios prestados a ADQPAL nao geram vinculo empregaticio, obrigacao trabalhista, previdenciaria ou afim.
      </p>
      <p className="mt-10 text-center">{data}</p>
      <SignatureBlock name={nome} caption={`CPF nº ${cpf}`} />
    </PrintShell>
  );
}
