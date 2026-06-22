import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function ProcuracaoPrint({ getValue }: PrintTemplateProps) {
  const outorgante = getValue("outorgante", "Naedja Silva Melo");
  const outorganteCpf = getValue("outorganteCpf", "065.660.824-25");
  const outorganteRg = getValue("outorganteRg", "___________________");
  const outorganteEndereco = getValue("outorganteEndereco", "___________________");
  const procurador = getValue("procurador", "___________________");
  const procuradorCpf = getValue("procuradorCpf", "___________________");
  const procuradorRg = getValue("procuradorRg", "___________________");
  const procuradorEndereco = getValue("procuradorEndereco", "___________________");
  const poderes = getValue("poderes", "representar a outorgante perante orgaos publicos, assinar documentos, receber oficios, protocolar requerimentos e praticar os atos necessarios ao fiel cumprimento deste instrumento");
  const validade = getValue("validade", "indeterminado");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Procuracao">
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        Procuracao
      </h1>
      <p className="text-justify">
        <strong>Outorgante:</strong> {outorgante}, CPF nº <strong>{outorganteCpf}</strong>, RG nº {outorganteRg}, residente em {outorganteEndereco}, na qualidade de representante legal da ADQPAL.
      </p>
      <p className="mt-6 text-justify">
        Pelo presente instrumento, nomeia e constitui como seu bastante procurador <strong>{procurador}</strong>, CPF nº <strong>{procuradorCpf}</strong>, RG nº {procuradorRg}, residente em {procuradorEndereco}.
      </p>
      <p className="mt-6 text-justify">
        O procurador recebe poderes para {poderes}, com prazo de validade {validade}.
      </p>
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name={outorgante} caption="Outorgante" />
    </PrintShell>
  );
}
