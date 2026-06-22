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

export function DoacaoCestaBasicaPrint({ getValue }: PrintTemplateProps) {
  const nome = getValue("nome", "___________________");
  const cpf = getValue("cpf", "___________________");
  const endereco = getValue("endereco", "___________________");
  const itens = getValue("itens");
  const observacoes = getValue("observacoes");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Termo de Doacao de Cesta Basica" subtitle="ADQPAL - Doacoes e Beneficios">
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        Termo de Doacao de Cesta Basica
      </h1>
      <p className="text-justify">
        A ADQPAL declara ter realizado a doacao de cesta basica ao(à) beneficiario(a) <strong>{nome}</strong>, CPF nº <strong>{cpf}</strong>, residente em {endereco}.
      </p>
      <section className="mt-8">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Itens doados</h2>
        <ListItems text={itens} />
      </section>
      {observacoes && (
        <section className="mt-8 rounded-lg border border-slate-300 bg-white/80 p-4">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Observacoes</h2>
          <p className="whitespace-pre-line">{observacoes}</p>
        </section>
      )}
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
