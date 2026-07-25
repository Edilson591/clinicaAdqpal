import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function DoacaoPrint({ getValue }: PrintTemplateProps) {
  const itemDoado = getValue("itemDoado", "___________________");
  const nome = getValue("nome", "___________________");
  const cpf = getValue("cpf", "___________________");
  const endereco = getValue("endereco", "___________________");
  const itens = getValue("itens");
  const observacoes = getValue("observacoes");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title={`Termo de Doacao de ${itemDoado}`} subtitle="ADQPAL - Doacoes e Beneficios">
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        Termo de Doacao de {itemDoado}
      </h1>
      <p className="text-justify">
        A ADQPAL declara ter realizado a doacao de <strong>{itemDoado}</strong> ao(à) beneficiario(a) <strong>{nome}</strong>, CPF nº <strong>{cpf}</strong>, residente em {endereco}.
      </p>
      {itens && (
        <section className="mt-8">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Descricao e quantidade</h2>
          <p className="whitespace-pre-line">{itens}</p>
        </section>
      )}
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
