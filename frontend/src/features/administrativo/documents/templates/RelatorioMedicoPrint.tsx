import type { PrintTemplateProps } from "../types";
import { PrintShell, SignatureBlock } from "./PrintShell";

export function RelatorioMedicoPrint({ getValue }: PrintTemplateProps) {
  const nome = getValue("nome", "___________________");
  const nascimento = getValue("nascimento", "___________________");
  const diagnostico = getValue("diagnostico", "___________________");
  const historico = getValue("historico", "Historico clinico nao informado.");
  const conduta = getValue("conduta", "Conduta nao informada.");
  const conclusao = getValue("conclusao", "Conclusao nao informada.");
  const medico = getValue("medico", "Medico responsavel");
  const crm = getValue("crm", "CRM/AL ______");
  const data = getValue("data", "Sao Miguel dos Campos/AL, ____ de __________ de ______");

  return (
    <PrintShell title="Relatorio Medico" subtitle="ADQPAL - Atendimento de Saude">
      <h1 className="mb-10 text-center text-lg font-bold uppercase tracking-[0.18em] text-[#2D3748]">
        Relatorio Medico
      </h1>
      <div className="mb-8 rounded-lg border border-slate-300 bg-white/80 p-5">
        <p><strong>Paciente:</strong> {nome}</p>
        <p><strong>Data de nascimento:</strong> {nascimento}</p>
        <p><strong>Diagnostico / CID:</strong> {diagnostico}</p>
      </div>
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Historico clinico</h2>
        <p className="whitespace-pre-line text-justify">{historico}</p>
      </section>
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Conduta / Tratamento</h2>
        <p className="whitespace-pre-line text-justify">{conduta}</p>
      </section>
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2D3748]">Conclusao / Parecer</h2>
        <p className="whitespace-pre-line text-justify">{conclusao}</p>
      </section>
      <p className="mt-12 text-center">{data}</p>
      <SignatureBlock name={`Dr(a). ${medico}`} caption={crm} />
    </PrintShell>
  );
}
