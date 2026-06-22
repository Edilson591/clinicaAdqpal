import type { PrintTemplateProps } from "../types";
import { PrintShell } from "./PrintShell";

export function ConvitePrint({ getValue }: PrintTemplateProps) {
  const titulo = getValue("titulo", "Convite");
  const kicker = getValue("kicker", "A ADQPAL tem a honra de convidar");
  const temas = getValue("temas", "Tema do evento");
  const texto = getValue("texto", "Texto do convite.");
  const dia = getValue("dia", "Data do evento");
  const horario = getValue("horario", "Horario");
  const local = getValue("local", "Local");
  const cidade = getValue("cidade", "Sao Miguel dos Campos/AL");

  return (
    <PrintShell title={titulo} subtitle="ADQPAL - Eventos e Convites">
      <div className="mx-auto max-w-[160mm] border-4 border-double border-[#2D3748] bg-[#fffdf8] px-10 py-12 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7533]">{kicker}</p>
        <h1 className="my-8 text-3xl font-black uppercase tracking-[0.18em] text-[#2D3748]">{titulo}</h1>
        <p className="whitespace-pre-line text-base leading-8">{texto}</p>
        <h2 className="my-8 text-2xl font-black uppercase text-[#2D3748]">{temas}</h2>
        <div className="mt-10 grid grid-cols-2 gap-6 text-sm"><div><strong>Dia</strong><br />{dia}</div><div><strong>Horario</strong><br />{horario}</div><div className="col-span-2"><strong>Local</strong><br />{local}</div></div>
        <p className="mt-10 text-sm">{cidade}</p>
      </div>
    </PrintShell>
  );
}
