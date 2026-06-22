import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

function ListItems({ text }: { text: string }) {
  const items = text.split("\n").map((item) => item.trim()).filter(Boolean);
  if (!items.length) return <p>Conforme relacao entregue.</p>;

  return (
    <ol className="mt-3 list-decimal space-y-1 pl-6">
      {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
    </ol>
  );
}

export function DoacaoEnxovalGestantePrint({ getValue }: PrintTemplateProps) {
  const nome = getValue("nome", "___________________");
  const cpf = getValue("cpf", "___________________");
  const endereco = getValue("endereco", "___________________");
  const previsaoParto = getValue("previsaoParto", "___________________");
  const itens = getValue("itens");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Termo de Doacao de Enxoval" subtitle="ADQPAL - Doacoes e Beneficios">
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        Termo de Doacao de Enxoval para Gestante
      </h1>
      <p className="text-justify">
        A ADQPAL declara ter realizado a doacao de enxoval a gestante <strong>{nome}</strong>, CPF nº <strong>{cpf}</strong>, residente em {endereco}, com previsao de parto em {previsaoParto}.
      </p>
      <section className="mt-8">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Itens doados</h2>
        <ListItems text={itens} />
      </section>
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
