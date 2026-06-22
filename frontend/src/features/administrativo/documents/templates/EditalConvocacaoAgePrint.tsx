import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function EditalConvocacaoAgePrint({ getValue }: PrintTemplateProps) {
  const gestao = getValue("gestao", "2024/2027");
  const dataAssembleia = getValue("dataAssembleia", "____ de __________ de ______");
  const horario = getValue("horario", "____h____");
  const local = getValue("local", "Sede da ADQPAL");
  const pauta = getValue("pauta", "deliberacao de assuntos de interesse institucional");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Edital de Convocacao AGE" subtitle="Assembleia Geral Extraordinaria - ADQPAL">
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        Edital de Convocacao
      </h1>
      <p className="text-justify">
        A Presidente da Associacao dos Dependentes Quimicos e Portadores de Doencas Psiquiatricas de Sao Miguel dos Campos/AL - ADQPAL, no uso de suas atribuicoes estatutarias, convoca os associados, familiares e interessados para participarem da Assembleia Geral Extraordinaria.
      </p>
      <div className="my-8 rounded-lg border border-slate-300 bg-white/80 p-5">
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div><dt className="font-bold uppercase text-slate-500">Gestao</dt><dd>{gestao}</dd></div>
          <div><dt className="font-bold uppercase text-slate-500">Data</dt><dd>{dataAssembleia}</dd></div>
          <div><dt className="font-bold uppercase text-slate-500">Horario</dt><dd>{horario}</dd></div>
          <div><dt className="font-bold uppercase text-slate-500">Local</dt><dd>{local}</dd></div>
        </dl>
      </div>
      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Pauta</h2>
        <p className="whitespace-pre-line text-justify">{pauta}</p>
      </section>
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name="Naedja Silva Melo" caption="Presidente / Representante Legal da O.S.C" />
    </PrintShell>
  );
}
