import { useState, useRef, useCallback, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { apacPrintSchema } from "../validate/apac.schema";
import { z } from "zod";

export const CNS_LENGTH = 15;
export const PROC_LENGTH = 8;
export const SEC_PROC_ROWS = [
  [21, 22, 23],
  [24, 25, 26],
  [27, 28, 29],
  [30, 31, 32],
  [33, 34, 35],
] as const;

export interface SecProcData {
  code: string[];
  nome: string;
  qtde: string;
}

export interface ApacData {
  f1_nome_estab: string;
  f2_cnes: string;
  f3_nome_paciente: string;
  f4_sexo: "mas" | "fem" | null;
  f5_prontuario: string;
  f6_cns: string[];
  dn: string[];
  f8_raca: string;
  f8_etnia: string;
  f9_mae: string;
  f10_ddd: string;
  f10_tel: string;
  f11_responsavel: string;
  f12_ddd: string;
  f12_tel: string;
  f13_endereco: string;
  f14_municipio: string;
  f15_ibge: string;
  f16_uf: string;
  f17_cep: string;
  f18_proc: string[];
  f19_proc_nome: string;
  f20_qtde: string;
  sec_procs: SecProcData[];
  f36_diagnostico: string;
  f37_cid_principal: string;
  f38_cid_sec: string;
  f39_cid_assoc: string;
  f40_obs: string;
  f41_prof_sol: string;
  ds: string[];
  f43_doc: "cns" | "cpf" | null;
  f44_doc: string[];
  f46_prof_aut: string;
  f47_orgao: string;
  f52_apac: string;
  f48_doc: "cns" | "cpf" | null;
  f49_doc: string[];
  da: string[];
  f54_executante: string;
  f55_cnes_exec: string;
  _selectedPatientId: string;
  _selectedDoctorId: string;
}

export function emptyApacData(): ApacData {
  return {
    f1_nome_estab:
      "ADQPAL-ASSOC.DOS DEPENDENTES QUIMICOS E PORTADORES DE DOENÇAS PSIQUIÁTRICAS",
    f2_cnes: "9033459",
    f3_nome_paciente: "",
    f4_sexo: null,
    f5_prontuario: "",
    f6_cns: Array(CNS_LENGTH).fill(""),
    dn: Array(8).fill(""),
    f8_raca: "",
    f8_etnia: "",
    f9_mae: "",
    f10_ddd: "",
    f10_tel: "",
    f11_responsavel: "",
    f12_ddd: "",
    f12_tel: "",
    f13_endereco: "",
    f14_municipio: "SÃO MIGUEL DOS CAMPOS / AL",
    f15_ibge: "",
    f16_uf: "AL",
    f17_cep: "",
    f18_proc: Array(PROC_LENGTH).fill(""),
    f19_proc_nome: "",
    f20_qtde: "",
    sec_procs: SEC_PROC_ROWS.map(() => ({
      code: Array(PROC_LENGTH).fill(""),
      nome: "",
      qtde: "",
    })),
    f36_diagnostico: "",
    f37_cid_principal: "",
    f38_cid_sec: "",
    f39_cid_assoc: "",
    f40_obs: "",
    f41_prof_sol: "LUIZ PAULO DE SOUZA PRAZERES",
    ds: Array(6).fill(""),
    f43_doc: "cns",
    f44_doc: "700007157748104".split(""),
    f46_prof_aut: "",
    f47_orgao: "",
    f52_apac: "",
    f48_doc: null,
    f49_doc: Array(CNS_LENGTH).fill(""),
    da: Array(6).fill(""),
    f54_executante: "",
    f55_cnes_exec: "",
    _selectedPatientId: "",
    _selectedDoctorId: "",
  };
}

export function formatDateBoxes(vals: string[]): string {
  if (vals.length === 8) {
    return `${vals.slice(0, 2).join("")}/${vals.slice(2, 4).join("")}/${vals.slice(4).join("")}`;
  }
  if (vals.length === 6) {
    return `${vals.slice(0, 2).join("")}/${vals.slice(2, 4).join("")}/${vals.slice(4).join("")}`;
  }
  return vals.join("");
}

function formatDateBoxesDisplay(vals: string[]): string {
  if (vals.length === 8) {
    const d = vals.slice(0, 2).join("");
    const m = vals.slice(2, 4).join("");
    const y = vals.slice(4).join("");
    if (!d && !m && !y) return "";
    return `${d}/${m}/${y}`;
  }
  if (vals.length === 6) {
    const d = vals.slice(0, 2).join("");
    const m = vals.slice(2, 4).join("");
    const y = vals.slice(4).join("");
    if (!d && !m && !y) return "";
    return `${d}/${m}/${y}`;
  }
  return vals.join("");
}

function generateApacHtml(data: ApacData): string {
  const d = (v: string) => v || "________________________";
  const db = (v: string[]) => formatDateBoxesDisplay(v) || "__/__/____";
  const cb = (v: string[]) => v.join("") || "_________________";
  const sexo =
    data.f4_sexo === "mas" ? "Mas." : data.f4_sexo === "fem" ? "Fem." : "";
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Laudo APAC - ${d(data.f3_nome_paciente)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 10pt; width: 210mm; min-height: 297mm; margin: auto; padding: 3mm; display: flex; flex-direction: column; }
  .s { background: #000 !important; color: #fff !important; text-align: center; font-weight: bold; font-size: 10pt; padding: 2px 0; }
  .r { display: flex; border: 1px solid #000; border-top: none; }
  .c { flex: 1; border-right: 1px solid #000; display: flex; flex-direction: column; }
  .c:last-child { border-right: none; }
  .l { font-size: 8.5pt; padding: 1px 2px 0; white-space: nowrap; }
  .v { font-size: 11pt; font-weight: bold; padding: 1px 2px; min-height: 18px; border-bottom: 1px solid #ccc; margin: 0 2px 2px; }
</style></head>
<body>
  <div style="display:flex;border:1px solid #000;">
    <div style="display:flex;align-items:center;border-right:1px solid #000;padding:3px 6px;gap:5px;">
      <div style="border:2px solid #000;font-weight:bold;font-size:13pt;padding:2px 5px;">SUS</div>
      <div style="font-size:7pt;"><div>Sistema<br>Único de<br>Saúde</div><div>Ministério<br>da<br>Saúde</div></div>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:bold;font-size:11pt;padding:4px 8px;">
      <em>LAUDO PARA SOLICITAÇÃO/AUTORIZAÇÃO DE<br>PROCEDIMENTO AMBULATORIAL</em>
    </div>
    <div style="font-size:7pt;font-style:italic;padding:3px 4px 0;border-left:1px solid #000;min-width:42px;text-align:right;">fls.1/2</div>
  </div>

  <div class="s">IDENTIFICAÇÃO DO ESTABELECIMENTO DE SAÚDE (SOLICITANTE)</div>
  <div class="r"><div class="c"><div class="l">1 - NOME DO ESTABELECIMENTO DE SAÚDE SOLICITANTE</div><div class="v">${d(data.f1_nome_estab)}</div></div><div class="c" style="max-width:90px;"><div class="l">2 - CNES</div><div class="v">${d(data.f2_cnes)}</div></div></div>

  <div class="s">IDENTIFICAÇÃO DO PACIENTE</div>
  <div class="r"><div class="c" style="flex:5;"><div class="l">3 - NOME DO PACIENTE</div><div class="v">${d(data.f3_nome_paciente)}</div></div><div class="c" style="min-width:58px;"><div class="l">4 - SEXO</div><div class="v">${sexo || "___"}</div></div><div class="c" style="max-width:85px;"><div class="l">5 - Nº DO PRONTUÁRIO</div><div class="v">${d(data.f5_prontuario)}</div></div></div>
  <div class="r"><div class="c" style="flex:3;"><div class="l">6 - CARTÃO NACIONAL DE SAÚDE (CNS)</div><div class="v">${cb(data.f6_cns)}</div></div><div class="c" style="flex:1.5;"><div class="l">7 - DATA DE NASCIMENTO</div><div class="v">${db(data.dn)}</div></div><div class="c"><div class="l">8 - RAÇA/COR</div><div class="v">${d(data.f8_raca)}</div></div><div class="c"><div class="l">8.1 - ETNIA</div><div class="v">${d(data.f8_etnia)}</div></div></div>
  <div class="r"><div class="c" style="flex:3;"><div class="l">9 - NOME DA MÃE</div><div class="v">${d(data.f9_mae)}</div></div><div class="c"><div class="l">10 - TELEFONE</div><div class="v">(${data.f10_ddd || "___"}) ${data.f10_tel || "_____________"}</div></div></div>
  <div class="r"><div class="c" style="flex:3;"><div class="l">11 - NOME DO RESPONSÁVEL</div><div class="v">${d(data.f11_responsavel)}</div></div><div class="c"><div class="l">12 - TELEFONE</div><div class="v">(${data.f12_ddd || "___"}) ${data.f12_tel || "_____________"}</div></div></div>
  <div class="r"><div class="c"><div class="l">13 - ENDEREÇO (RUA, Nº, BAIRRO)</div><div class="v">${d(data.f13_endereco)}</div></div></div>
  <div class="r"><div class="c" style="flex:3;"><div class="l">14 - MUNICÍPIO DE RESIDÊNCIA</div><div class="v">${d(data.f14_municipio)}</div></div><div class="c" style="flex:1.2;"><div class="l">15 - CÓD. IBGE</div><div class="v">${d(data.f15_ibge)}</div></div><div class="c" style="max-width:40px;"><div class="l">16 - UF</div><div class="v">${d(data.f16_uf)}</div></div><div class="c"><div class="l">17 - CEP</div><div class="v">${d(data.f17_cep)}</div></div></div>

  <div class="s">PROCEDIMENTO SOLICITADO</div>
  <div class="r"><div class="c" style="max-width:135px;"><div class="l">18 - CÓD. PROCEDIMENTO</div><div class="v">${cb(data.f18_proc)}</div></div><div class="c" style="flex:4;"><div class="l">19 - NOME DO PROCEDIMENTO PRINCIPAL</div><div class="v">${d(data.f19_proc_nome)}</div></div><div class="c" style="max-width:48px;"><div class="l">20 - QTDE</div><div class="v">${d(data.f20_qtde)}</div></div></div>

  <div class="s">PROCEDIMENTO(S) SECUNDÁRIO(S)</div>
  ${data.sec_procs
    .map((sp, i) => {
      const [a, b] = [21 + i * 3, 22 + i * 3];
      return `<div class="r"><div class="c" style="max-width:135px;"><div class="l">${a} - CÓDIGO</div><div class="v">${cb(sp.code)}</div></div><div class="c" style="flex:4;"><div class="l">${b} - NOME</div><div class="v">${d(sp.nome)}</div></div><div class="c" style="max-width:48px;"><div class="l">${b + 1} - QTDE</div><div class="v">${d(sp.qtde)}</div></div></div>`;
    })
    .join("")}

  <div class="s">JUSTIFICATIVA DO(S) PROCEDIMENTO(S) SOLICITADO(S)</div>
  <div class="r"><div class="c" style="flex:2;"><div class="l">36 - DESCRIÇÃO DO DIAGNÓSTICO</div><div class="v">${d(data.f36_diagnostico)}</div></div><div class="c" style="flex:0.8;"><div class="l">37-CID10 PRINCIPAL</div><div class="v">${d(data.f37_cid_principal)}</div></div><div class="c" style="flex:0.8;"><div class="l">38-CID10 SEC</div><div class="v">${d(data.f38_cid_sec)}</div></div><div class="c"><div class="l">39-CID10 CAUSAS ASSOC</div><div class="v">${d(data.f39_cid_assoc)}</div></div></div>

  <div style="flex:1;border:1px solid #000;border-top:none;display:flex;min-height:80px;">
    <div style="flex:1;display:flex;flex-direction:column;">
      <div class="l">40 - OBSERVAÇÕES</div>
      <div style="padding:2px;font-size:10.5pt;font-weight:bold;white-space:pre-wrap;">${data.f40_obs || ""}</div>
    </div>
  </div>

  <div class="s">SOLICITAÇÃO</div>
  <div class="r"><div class="c" style="flex:2;"><div class="l">41 - NOME DO PROFISSIONAL SOLICITANTE</div><div class="v">${d(data.f41_prof_sol)}</div></div><div class="c" style="max-width:95px;"><div class="l">42-DATA</div><div class="v">${db(data.ds)}</div></div><div class="c"><div class="l">45-ASSINATURA E CARIMBO</div></div></div>
  <div class="r"><div class="c" style="max-width:78px;"><div class="l">43 - DOC</div><div class="v">${data.f43_doc === "cns" ? "CNS" : data.f43_doc === "cpf" ? "CPF" : ""}</div></div><div class="c" style="flex:2;"><div class="l">44 - Nº DOCUMENTO</div><div class="v">${cb(data.f44_doc)}</div></div></div>

  <div class="s">AUTORIZAÇÃO</div>
  <div class="r"><div class="c" style="flex:2;"><div class="l">46 - NOME DO PROFISSIONAL AUTORIZADOR</div><div class="v">${d(data.f46_prof_aut)}</div></div><div class="c"><div class="l">47 - ÓRGÃO EMISSOR</div><div class="v">${d(data.f47_orgao)}</div></div><div class="c"><div class="l">52 - Nº AUTORIZAÇÃO (APAC)</div><div class="v">${d(data.f52_apac)}</div></div></div>
  <div class="r"><div class="c" style="max-width:78px;"><div class="l">48 - DOC</div><div class="v">${data.f48_doc === "cns" ? "CNS" : data.f48_doc === "cpf" ? "CPF" : ""}</div></div><div class="c" style="flex:2;"><div class="l">49 - Nº DOCUMENTO</div><div class="v">${cb(data.f49_doc)}</div></div></div>
  <div class="r"><div class="c" style="max-width:95px;"><div class="l">50-DATA AUTORIZAÇÃO</div><div class="v">${db(data.da)}</div></div><div class="c" style="flex:2;"><div class="l">51 - ASSINATURA E CARIMBO</div></div><div class="c"><div class="l">53 - VALIDADE APAC</div></div></div>

  <div class="s">IDENTIFICAÇÃO DO ESTABELECIMENTO DE SAÚDE (EXECUTANTE)</div>
  <div class="r"><div class="c" style="flex:4;"><div class="l">54 - NOME FANTASIA</div><div class="v">${d(data.f54_executante)}</div></div><div class="c" style="max-width:90px;"><div class="l">55 - CNES</div><div class="v">${d(data.f55_cnes_exec)}</div></div></div>

  <div style="font-size:5pt;color:#555;padding-top:1px;">01-Laudo Solic. Proc. Amb Atualizada_21-10-10.vsd</div>
</body></html>`;
}

const PRINT_PAGE_STYLE = `
  @page { size: A4; margin: 4mm; }
  body { background: white !important; padding: 0 !important; margin: 0 !important; }
  .no-print { display: none !important; }
  #apac-form { box-shadow: none !important; width: 100% !important; height: 100vh !important; margin: 0 !important; }
  .apac-page { box-shadow: none !important; }
  .bg-black { background: #000 !important; color: #fff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  input, textarea { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  input:focus, textarea:focus { background: transparent !important; }
`;

function validateApacData(data: ApacData): string[] {
  try {
    apacPrintSchema.parse(data);
    return [];
  } catch (err) {
    if (err instanceof z.ZodError) {
      return err.issues.map((i) => i.message);
    }
    return ["Erro inesperado de validação."];
  }
}

export function useApacLaudoPage() {
  const [data, setData] = useState<ApacData>(() => {
    try {
      const saved = localStorage.getItem("apac_laudo");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed._selectedPatientId) parsed._selectedPatientId = "";
        if (!parsed._selectedDoctorId) parsed._selectedDoctorId = "";
        return parsed;
      }
    } catch {
      /* ignore */
    }
    return emptyApacData();
  });

  const [errors, setErrors] = useState<string[]>([]);

  const formRef = useRef<HTMLDivElement>(null);

  const handlePrintBase = useReactToPrint({
    contentRef: formRef,
    documentTitle: `Laudo APAC - ${data.f3_nome_paciente || "ADQPAL"}`,
    pageStyle: PRINT_PAGE_STYLE,
  });

  const handlePrint = useCallback(() => {
    const validationErrors = validateApacData(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    handlePrintBase();
  }, [data, handlePrintBase]);

  useEffect(() => {
    localStorage.setItem("apac_laudo", JSON.stringify(data));
  }, [data]);

  const update = useCallback(
    <K extends keyof ApacData>(key: K, value: ApacData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
      setErrors([]);
    },
    [],
  );

  const updateSecProc = useCallback(
    (
      index: number,
      field: "code" | "nome" | "qtde",
      value: string[] | string,
    ) => {
      setData((prev) => {
        const next = [...prev.sec_procs];
        next[index] = { ...next[index], [field]: value };
        return { ...prev, sec_procs: next };
      });
      setErrors([]);
    },
    [],
  );

  const handleSave = useCallback(() => {
    const validationErrors = validateApacData(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    localStorage.setItem("apac_laudo", JSON.stringify(data));
    const html = generateApacHtml(data);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const nomePaciente = (data.f3_nome_paciente || "sem_paciente")
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w-]/g, "");
    a.download = `apac_${nomePaciente}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  const handleClear = useCallback(() => {
    if (confirm("Deseja limpar todos os campos?")) {
      localStorage.removeItem("apac_laudo");
      setData(emptyApacData());
      setErrors([]);
    }
  }, []);

  return {
    data,
    errors,
    formRef,
    update,
    updateSecProc,
    handlePrint,
    handleSave,
    handleClear,
  };
}
