import { useState, useCallback, useEffect } from "react";
import { LOGO_B64, ASSIN_B64, MARKWATER } from "./receituarioImages";
import {
  receituarioExamesSchema,
  receituarioReceitaSchema,
  receituarioControleSchema,
  receituarioEncaminhamentoSchema,
  receituarioAutorizacaoSchema,
} from "../validate/receituario.schema";
import { z } from "zod";
import { formatDateBr } from "../utils/formatDate";

export const EXAMS = [
  { cat: "Bioquímica Geral", items: ["Ácido Úrico","Fosfatase Alcalina","Gama GT","Proteína C Reativa","Muco-Proteína","Proteínas: Total e Frações","Ureia","Creatinina","Bilirrubinas","Bilirrubinas Totais e Frações","Cálcio","Magnésio","Fósforo","Albumina","Amilase"] },
  { cat: "Glicemia / Metabólico", items: ["Glicemia de Jejum","Hemoglobina Glicosilada","Sódio","Potássio","Transaminases","TGO","TGP"] },
  { cat: "Lipídios", items: ["Lipidograma","Triglicerídeos","Colesterol Total e Frações","Perfil Lipídico"] },
  { cat: "Hematologia / Coagulação", items: ["Hemograma Completo","VHS","Coagulograma","ASLO","IFI para Chagas"] },
  { cat: "Microbiologia / Urina", items: ["Sumário de Urina","Urocultura c/ Contagem de Colônias","Parasitológico de Fezes","Látex","Oro-Cultura","Antibiograma"] },
  { cat: "Cardiologia / Imagem", items: ["Eletrocardiograma","Ecodopplercardiograma","Teste Ergométrico","Holter 24h em 3 Canais","MAPA","Radiografia do Tórax: PA e Perfil","Raios X dos Seios da Face"] },
  { cat: "Raios X / Coluna", items: ["Rx Coluna Cervical","Rx Coluna Dorsal","Rx Coluna Lombar","Rx Extremidades"] },
  { cat: "Ultrassonografia", items: ["Ultrassonografia de Abdome Total","Ultrassonografia de Abdome","Ultrassonografia de Hipocôndrio D","Ultrassonografia de Aparelho Urinário","USG Pélvica + Endovaginal","USG das Mamas e Axilas"] },
  { cat: "Endoscopia / Oncologia", items: ["Endoscopia Digestiva Alta","Colonoscopia","Citologia Oncótica","CA 125"] },
  { cat: "Hormônios / Especiais", items: ["T3, T4 Livre, TSH","Ferro Sérico","Ferritina","Vitamina B12","Vitamina D","Cortisol Livre","Testosterona Livre","Testosterona Total","Beta HCG","Anti-DNA"] },
  { cat: "Tipagem / Outros", items: ["Grupo Sanguíneo ABO e Fator RhO","Fator Reumatóide","Bacterioscopia (Secreção)","Schistosomose (IgG) Pesquisa","Teste do Pezinho Naster","Toxicológico CNH"] },
  { cat: "Infectologia / Viral", items: ["IgG e IgM (Dengue)","SARS-CoV-2 / COVID-19","Chikungunya Anticorpos","Sorologia para HIV 1 e 2","Sorologia para Sífilis VDRL","Hepatite (B) HBsAg","Hepatite (C) HCV","Herpes IgG/IgM","PCR"] },
];

export type RecTab = "exames" | "receita_com" | "receita_sem" | "controle" | "encaminhamento" | "autorizacao";

export interface ReceituarioData {
  tab: RecTab;
  examPatient: string;
  examJustificativa: string;
  examSelected: string[];
  recComPatient: string;
  recComData: Date;
  recComMed: string;
  recComObs: string;
  recSemPatient: string;
  recSemData: Date;
  recSemMed: string;
  recSemObs: string;
  cePacNome: string;
  cePacEnd: string;
  cePrescricao: string;
  ceCompNome: string;
  ceCompIdent: string;
  ceCompOrgao: string;
  ceCompEnd: string;
  ceCompCidade: string;
  ceCompUf: string;
  ceCompTel: string;
  encPatient: string;
  encDest: string;
  encEspec: string;
  encMedico: string;
  encJust: string;
  encObs: string;
  autNome: string;
  autDn: string;
  autCpf: string;
  autRg: string;
  autSus: string;
  autTipo: string;
  _selectedPatientId: string;
}

function emptyData(): ReceituarioData {
  return {
    tab: "exames",
    examPatient: "",
    examJustificativa: "Rotina",
    examSelected: [],
    recComPatient: "",
    recComData: new Date(),
    recComMed: "",
    recComObs: "",
    recSemPatient: "",
    recSemData: new Date(),
    recSemMed: "",
    recSemObs: "",
    cePacNome: "",
    cePacEnd: "",
    cePrescricao: "",
    ceCompNome: "",
    ceCompIdent: "",
    ceCompOrgao: "",
    ceCompEnd: "",
    ceCompCidade: "",
    ceCompUf: "",
    ceCompTel: "",
    encPatient: "",
    encDest: "",
    encEspec: "",
    encMedico: "",
    encJust: "",
    encObs: "",
    autNome: "",
    autDn: "",
    autCpf: "",
    autRg: "",
    autSus: "",
    autTipo: "",
    _selectedPatientId: "",
  };
}

function getCurrentDate(): string {
  const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const d = new Date();
  return `São Miguel dos Campos/AL, ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

function makeWatermark(): string {
  return `<img style="position:fixed;top:50%;left:42%;transform:translate(-50%,-50%);width:75%;opacity:0.12;z-index:0;pointer-events:none;" src="${MARKWATER}" alt="">`;
}

function makeHeader(title: string): string {
  return makeWatermark() +
    `<div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:8px;margin-bottom:14px;border-bottom:3px solid #1a3a2a;">
      <img style="height:75px;max-width:370px;object-fit:contain;display:block;" src="${LOGO_B64}" alt="ADQPAL">
      <div style="background:#1a3a2a;color:#fff;padding:10px 22px;text-align:center;">
        <div style="font-size:14px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">${title}</div>
        <div style="font-size:8px;letter-spacing:0.1em;color:#a0c8a8;margin-top:3px;text-transform:uppercase;">ADQPAL — São Miguel dos Campos/AL</div>
      </div>
    </div>`;
}

const RODAPE = `<div style="margin-top:10px;border-top:2px solid #000;padding:5px 6px;font-size:8px;font-weight:700;text-align:center;background:#f5f5f5;">Praça Dr. José Inácio, 173 – Centro – São Miguel dos Campos/AL – CNPJ 16.920.069/0001-73 – associacaoadqpaloficial@gmail.com – (82) 991636096</div>`;

function generateRecHtml(data: ReceituarioData): string {
  const n = (v: string) => v || "________________________";
  const nm = (v: string) => v || "________________________________________";

  let body = "";

  if (data.tab === "exames") {
    const sel = data.examSelected;
    const allItems = EXAMS.flatMap(g => g.items);
    const lines = allItems.map(e =>
      sel.includes(e)
        ? `<div style="display:flex;gap:5px;padding:2.5px 0;break-inside:avoid;"><span style="font-family:monospace;font-size:11px;font-weight:700;">( x )</span><span style="font-size:12px;font-weight:700;">${e}</span></div>`
        : `<div style="display:flex;gap:5px;padding:2.5px 0;break-inside:avoid;"><span style="font-family:monospace;font-size:10px;">(&nbsp;&nbsp;&nbsp;)</span><span style="font-size:11px;">${e}</span></div>`
    ).join("");
    body = makeHeader("Solicitação de Exames") +
      `<div style="background:#f4f8f4;border-left:4px solid #1a3a2a;padding:7px 12px;margin-bottom:8px;">
        <div style="font-size:8px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#5a6a5a;">Paciente</div>
        <div style="font-size:16px;font-weight:700;">${n(data.examPatient)}</div>
      </div>
      <div style="font-size:12px;font-weight:700;background:#f0f0f0;border-left:4px solid #000;padding:5px 12px;margin-bottom:10px;">Justificativa: <strong>${data.examJustificativa || "Rotina"}</strong></div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#1a3a2a;margin-bottom:6px;border-bottom:1px solid #ccc;padding-bottom:3px;">Solicito:</div>
      <div style="columns:3;column-gap:16px;margin-bottom:10px;">${lines}</div>
      <div style="border-top:1px solid #bbb;padding-top:8px;margin-top:auto;text-align:center;">
        <div style="display:inline-block;text-align:center;">
          <div style="font-size:10px;color:#333;margin-bottom:4px;">${getCurrentDate()}</div>
          <img style="display:block;max-width:160px;height:auto;margin:0 auto;mix-blend-mode:multiply;" src="${ASSIN_B64}" alt="Assinatura">
          <div style="border-top:1px solid #333;width:200px;margin:3px auto;"></div>
          <div style="font-size:10px;color:#444;">Assinatura e Carimbo Médico</div>
        </div>
      </div>`;
  } else if (data.tab === "receita_com" || data.tab === "receita_sem") {
    const isCom = data.tab === "receita_com";
    const p = isCom ? data.recComPatient : data.recSemPatient;
    const med = isCom ? data.recComMed : data.recSemMed;
    const obs = isCom ? data.recComObs : data.recSemObs;
    const dateStr = isCom ?  formatDateBr(data.recComData) : formatDateBr(data.recSemData);
    const medLines = med.split("\n").filter(l => l.trim()).map(l =>
      `<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #eee;font-size:13px;"><span style="color:#1a3a2a;font-weight:700;">•</span><span>${l}</span></div>`
    ).join("");
    const signBlock = isCom
      ? `<div style="border-top:1px solid #bbb;padding-top:16px;margin-top:auto;text-align:center;">
          <div style="display:inline-block;text-align:center;">
            <div style="font-size:11px;color:#333;margin-bottom:6px;">${dateStr || getCurrentDate()}</div>
            <img style="display:block;max-width:160px;height:auto;margin:0 auto;mix-blend-mode:multiply;" src="${ASSIN_B64}" alt="Assinatura">
            <div style="border-top:1px solid #333;width:200px;margin:4px auto;"></div>
            <div style="font-size:10px;color:#444;">Dr. Luiz Paulo Prezeres — Médico — CRM-AL 9446</div>
          </div>
        </div>`
      : `<div style="border-top:1px solid #bbb;padding-top:16px;margin-top:auto;text-align:center;">
          <div style="display:inline-block;text-align:center;">
            <div style="font-size:11px;color:#333;margin-bottom:60px;">${dateStr || getCurrentDate()}</div>
            <div style="border-top:1px solid #333;width:240px;margin:4px auto;"></div>
            <div style="font-size:10px;color:#444;">Assinatura e Carimbo Médico</div>
          </div>
        </div>`;
    body = makeWatermark() +
      `<div style="display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #1a3a2a;padding-bottom:8px;margin-bottom:14px;">
        <img style="height:75px;max-width:370px;object-fit:contain;display:block;" src="${LOGO_B64}" alt="ADQPAL">
        <div style="background:#1a3a2a;color:#fff;padding:10px 22px;text-align:center;">
          <div style="font-size:14px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">Receita Médica</div>
          <div style="font-size:8px;letter-spacing:0.1em;color:#a0c8a8;margin-top:3px;text-transform:uppercase;">ADQPAL — São Miguel dos Campos/AL</div>
        </div>
      </div>
      <div style="background:#f4f8f4;border-left:4px solid #1a3a2a;padding:10px 14px;margin-bottom:20px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#5a6a5a;">Paciente</div>
        <div style="font-size:18px;font-weight:700;">${n(p)}</div>
      </div>
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#1a3a2a;border-bottom:1px solid #ccc;padding-bottom:4px;margin:20px 0 10px;">Medicamentos Prescritos</div>
      <div style="margin-bottom:16px;">${medLines || "<div style='padding:8px;color:#999;font-style:italic;'>Nenhum medicamento informado</div>"}</div>
      ${obs ? `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#1a3a2a;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:8px;">Observações</div><div style="border:1px solid #bbb;padding:8px 12px;font-size:13px;margin-bottom:16px;">${obs}</div>` : ""}
      ${signBlock}`;
  } else if (data.tab === "controle") {
    const f = (label: string, value: string, w?: string) =>
      `<div style="margin-bottom:6px;${w ? `flex:${w};` : ""}"><div style="font-size:10px;color:#444;">${label}:</div><div style="font-size:12px;border-bottom:1px solid #999;padding-bottom:2px;min-height:16px;">${value || ""}</div></div>`;
    const prescLines = (data.cePrescricao || "").split("\n").filter(l => l.trim()).map(l =>
      `<div style="border-bottom:1px solid #ccc;padding:5px 0;font-size:12px;">${l}</div>`
    ).join("");
    const pad = 4 - (data.cePrescricao || "").split("\n").filter(l => l.trim()).length;
    const filledPresc = prescLines + (pad > 0 ? Array(pad).fill("<div style='border-bottom:1px solid #ccc;padding:5px 0;font-size:12px;'>&nbsp;</div>").join("") : "");
    body = makeWatermark() +
      `<div style="display:flex;align-items:center;gap:14px;border-bottom:2px solid #1a3a2a;padding-bottom:8px;margin-bottom:10px;">
        <img style="height:65px;object-fit:contain;" src="${LOGO_B64}" alt="ADQPAL">
        <div>
          <div style="font-size:11px;font-weight:700;color:#1a3a2a;">Associação dos Dependentes Químicos e Portadores de Doenças Psiquiátricos de São Miguel dos Campos / Alagoas</div>
          <div style="font-size:9px;color:#555;margin-top:2px;">Praça Dr. José Inácio, 173 - Centro - São Miguel dos Campos/AL - CNPJ: 16.920.069/0001-73</div>
        </div>
      </div>
      <div style="text-align:center;font-size:18px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;margin:10px 0 14px;">Receituário Controle Especial</div>
      <div style="border:2px solid #1a3a2a;border-radius:8px;padding:10px 14px;margin-bottom:12px;">
        <div style="font-size:11px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;color:#1a3a2a;">Identificação do Emitente</div>
        ${f("Nome", "Luiz Paulo Prezeres")}
        <div style="display:flex;gap:16px;">${f("CRM", "CRM-AL 9446","1")}${f("MF","","1")}${f("Nº","","0.5")}</div>
        ${f("Endereço", "Praça Dr. José Inácio, 173 - Centro")}
        <div style="display:flex;gap:16px;">${f("Cidade","São Miguel dos Campos","1")}${f("UF","AL","0.3")}</div>
        ${f("Telefone","(82) 991636096","")}
      </div>
      ${f("Paciente", nm(data.cePacNome))}
      ${f("Endereço", nm(data.cePacEnd))}
      <div style="margin:10px 0 4px;font-size:10px;color:#444;">Prescrição:</div>
      <div style="margin-bottom:14px;">${filledPresc}</div>
      <div style="text-align:right;margin-bottom:14px;"><div style="display:inline-block;width:240px;"><div style="border-top:1px solid #333;padding-top:3px;font-size:9px;color:#444;text-align:center;">Assinatura e Carimbo do Médico</div></div></div>
      <div style="display:flex;gap:10px;border-top:1px solid #bbb;padding-top:10px;">
        <div style="flex:1;border:1.5px solid #1a3a2a;border-radius:6px;padding:8px 10px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;text-align:center;margin-bottom:6px;">Identificação do Comprador</div>
          ${f("Nome", nm(data.ceCompNome))}${f("Ident.", nm(data.ceCompIdent))}${f("Órg. Emissor", nm(data.ceCompOrgao))}${f("End.", nm(data.ceCompEnd))}
          <div style="display:flex;gap:10px;">${f("Cidade", nm(data.ceCompCidade),"1")}${f("UF", data.ceCompUf || "","0.3")}</div>
          ${f("Telefone", nm(data.ceCompTel))}
        </div>
        <div style="flex:1;border:1.5px solid #1a3a2a;border-radius:6px;padding:8px 10px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;text-align:center;margin-bottom:6px;">Identificação do Fornecedor</div>
          <div style="font-size:10px;color:#444;margin-bottom:4px;">FIRMA:</div>
          <div style="min-height:30px;border-bottom:0.5px solid #ccc;margin-bottom:20px;"></div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px;">
            <div style="text-align:center;flex:1;"><div style="border-top:1px solid #333;font-size:8px;padding-top:2px;">Assinatura do Farmacêutico</div></div>
            <div style="text-align:center;width:80px;"><div style="border-top:1px solid #333;font-size:8px;padding-top:2px;">Data</div></div>
          </div>
        </div>
      </div>
      <div style="text-align:center;font-size:9px;font-weight:700;margin-top:8px;margin-bottom:auto;color:#1a3a2a;">1ª VIA - FARMÁCIA &nbsp;/&nbsp; 2ª VIA - PACIENTE</div>`;
  } else if (data.tab === "encaminhamento") {
    body = makeWatermark() +
      `<div style="display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #1a3a2a;padding-bottom:8px;margin-bottom:14px;">
        <img style="height:75px;max-width:370px;object-fit:contain;display:block;" src="${LOGO_B64}" alt="ADQPAL">
        <div style="background:#1a3a2a;color:#fff;padding:10px 22px;text-align:center;">
          <div style="font-size:14px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">Encaminhamento Médico</div>
          <div style="font-size:8px;letter-spacing:0.1em;color:#a0c8a8;margin-top:3px;text-transform:uppercase;">ADQPAL — São Miguel dos Campos/AL</div>
        </div>
      </div>
      <div style="background:#f4f8f4;border-left:4px solid #1a3a2a;padding:10px 14px;margin-bottom:20px;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#5a6a5a;">Paciente</div>
        <div style="font-size:18px;font-weight:700;">${n(data.encPatient)}</div>
      </div>
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#1a3a2a;border-bottom:1px solid #ccc;padding-bottom:4px;margin-bottom:16px;">Solicito</div>
      ${data.encDest ? `<div style="margin-bottom:16px;"><div style="font-size:8px;font-weight:700;text-transform:uppercase;color:#888;">Encaminhar para</div><div style="font-size:13px;font-weight:700;text-transform:uppercase;border-bottom:1px solid #ddd;padding-bottom:5px;">${data.encDest}</div></div>` : ""}
      ${data.encEspec ? `<div style="margin-bottom:16px;"><div style="font-size:8px;font-weight:700;text-transform:uppercase;color:#888;">Especialidade</div><div style="font-size:15px;font-weight:700;text-transform:uppercase;border-bottom:1px solid #ddd;padding-bottom:5px;">${data.encEspec}</div></div>` : ""}
      ${data.encMedico ? `<div style="margin-bottom:16px;"><div style="font-size:8px;font-weight:700;text-transform:uppercase;color:#888;">Médico</div><div style="font-size:13px;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:5px;">${data.encMedico}</div></div>` : ""}
      <div style="background:#f0f0f0;border-left:4px solid #000;padding:10px 14px;margin:20px 0;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:#555;">Justificativa</div>
        <div style="font-size:16px;font-weight:700;text-transform:uppercase;">${data.encJust || "___________________________"}</div>
      </div>
      ${data.encObs ? `<div style="margin-bottom:14px;"><div style="font-size:9px;font-weight:700;text-transform:uppercase;color:#888;">Informações Clínicas</div><div style="border:1px solid #bbb;padding:8px 10px;font-size:12px;min-height:30px;">${data.encObs}</div></div>` : ""}
      <div style="border-top:1px solid #bbb;padding-top:8px;margin-top:auto;text-align:center;">
        <div style="display:inline-block;text-align:center;">
          <div style="font-size:10px;color:#333;margin-bottom:4px;">${getCurrentDate()}</div>
          <img style="display:block;max-width:160px;height:auto;margin:0 auto;mix-blend-mode:multiply;" src="${ASSIN_B64}" alt="Assinatura">
          <div style="border-top:1px solid #333;width:200px;margin:3px auto;"></div>
          <div style="font-size:10px;color:#444;">Assinatura e Carimbo Médico</div>
        </div>
      </div>`;
  } else if (data.tab === "autorizacao") {
    const f = (label: string, value: string) =>
      `<div style="padding:4px 0;border-bottom:1px solid #e0e0e0;"><span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888;">${label}: </span><span style="font-size:13px;">${n(value)}</span></div>`;
    body = makeWatermark() +
      `<div style="text-align:center;padding-bottom:10px;margin-bottom:14px;border-bottom:3px solid #1a3a2a;"><img style="height:70px;display:inline-block;" src="${LOGO_B64}" alt="ADQPAL"></div>
      <div style="font-size:15px;font-weight:700;text-align:center;text-transform:uppercase;margin-bottom:18px;letter-spacing:0.05em;">Autorização de Exames</div>
      ${f("Paciente", data.autNome)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;margin-bottom:14px;">
        <div>${f("DN", data.autDn)}${f("CPF", data.autCpf)}${f("RG", data.autRg)}</div>
        <div>${f("Cartão SUS", data.autSus)}${f("Convênio", "ADQPAL")}${f("Endereço", "SMC")}</div>
      </div>
      <div style="margin:12px 0 18px;font-size:14px;font-weight:700;text-transform:uppercase;">Tipo de Exame: ${data.autTipo || "___________________________"}</div>
      <div style="margin-top:auto;">
        <div style="border-top:1px solid #333;width:220px;margin:0 auto 4px;"></div>
        <div style="text-align:center;font-size:11px;font-weight:700;">NAEDJA SILVA MELO</div>
        <div style="text-align:center;font-size:10px;color:#333;">PRESIDENTE - AUTORIZADOR</div>
      </div>`;
  }

  const pageStyle = data.tab === "controle" ? `
    @page { size: A4; margin: 8mm 12mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; width: 210mm; min-height: 297mm; margin: auto; padding: 8mm 12mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  ` : `
    @page { size: A4; margin: 10mm 15mm 12mm 15mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; width: 210mm; min-height: 297mm; margin: auto; padding: 10mm 15mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  `;

  const title = data.tab === "exames" ? "Solicitação de Exames"
    : data.tab === "encaminhamento" ? "Encaminhamento Médico"
    : data.tab === "autorizacao" ? "Autorização de Exames"
    : "Receita Médica";

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${title} - ADQPAL</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  ${pageStyle}
  @media print {
    body { background: #fff !important; }
    .doc-watermark { position: fixed; top: 50%; left: 42%; transform: translate(-50%,-50%); width: 75%; opacity: 0.12; z-index: 0; pointer-events: none; }
  }
</style></head><body style="display: flex; flex-direction: column; min-height: 100vh;">
  ${body + RODAPE}
</body></html>`;
}

// function getPdfFilename(tab: RecTab, d: ReceituarioData): string {
//   const labels: Record<RecTab, string> = {
//     exames: "Solicitacao de Exames",
//     receita_com: "Receita Medica",
//     receita_sem: "Receita Medica",
//     controle: "Controle Especial",
//     encaminhamento: "Encaminhamento Medico",
//     autorizacao: "Autorizacao de Exames",
//   };
//   const patientMap: Record<RecTab, () => string> = {
//     exames: () => d.examPatient,
//     receita_com: () => d.recComPatient,
//     receita_sem: () => d.recSemPatient,
//     controle: () => d.cePacNome,
//     encaminhamento: () => d.encPatient,
//     autorizacao: () => d.autNome,
//   };
//   const label = labels[tab];
//   const raw = patientMap[tab]() || "sem_paciente";
//   const patient = raw
//     .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
//     .replace(/[^a-zA-Z0-9\s-]/g, "").trim() || "sem_paciente";
//   return `${label} - ${patient}.pdf`;
// }

function validateTab(data: ReceituarioData): string[] {
  const tab = data.tab;
  try {
    if (tab === "exames") {
      receituarioExamesSchema.parse(data);
    } else if (tab === "receita_com") {
      receituarioReceitaSchema.parse({ patient: data.recComPatient, medicamentos: data.recComMed });
    } else if (tab === "receita_sem") {
      receituarioReceitaSchema.parse({ patient: data.recSemPatient, medicamentos: data.recSemMed });
    } else if (tab === "controle") {
      receituarioControleSchema.parse(data);
    } else if (tab === "encaminhamento") {
      receituarioEncaminhamentoSchema.parse(data);
    } else if (tab === "autorizacao") {
      receituarioAutorizacaoSchema.parse(data);
    }
    return [];
  } catch (err) {
    if (err instanceof z.ZodError) {
      return err.issues.map((i) => i.message);
    }
    return ["Erro inesperado de validação."];
  }
}

export function useReceituarioPage() {
  const [data, setData] = useState<ReceituarioData>(() => {
    try {
      const saved = localStorage.getItem("receituario");
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return emptyData();
  });

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("receituario", JSON.stringify(data));
  }, [data]);

  const update = useCallback(<K extends keyof ReceituarioData>(key: K, value: ReceituarioData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors([]);
  }, []);

  const setTab = useCallback((tab: RecTab) => {
    setData((prev) => ({ ...prev, tab }));
    setErrors([]);
  }, []);

  const updateMultiple = useCallback((updates: Partial<ReceituarioData>) => {
    setData((prev) => ({ ...prev, ...updates }));
    setErrors([]);
  }, []);

  const toggleExam = useCallback((exam: string) => {
    setData((prev) => ({
      ...prev,
      examSelected: prev.examSelected.includes(exam)
        ? prev.examSelected.filter((e) => e !== exam)
        : [...prev.examSelected, exam],
    }));
    setErrors([]);
  }, []);

  const toggleExamCategory = useCallback((catIndex: number) => {
    setData((prev) => {
      const items = EXAMS[catIndex].items;
      const allSelected = items.every((i) => prev.examSelected.includes(i));
      const next = allSelected
        ? prev.examSelected.filter((e) => !items.includes(e))
        : [...new Set([...prev.examSelected, ...items])];
      return { ...prev, examSelected: next };
    });
    setErrors([]);
  }, []);

  const selectedCount = data.examSelected.length;

  const handlePrint = useCallback(() => {
    const validationErrors = validateTab(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    localStorage.setItem("receituario", JSON.stringify(data));
    const html = generateRecHtml(data);
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      setErrors(["Pop-up bloqueado. Permita pop-ups para imprimir."]);
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }, [data]);

  const handleSave = useCallback(() => {
    const validationErrors = validateTab(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    localStorage.setItem("receituario", JSON.stringify(data));
    const html = generateRecHtml(data);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receituario_adqpal.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  const handleClear = useCallback(() => {
    if (confirm("Deseja limpar todos os campos?")) {
      localStorage.removeItem("receituario");
      setData(emptyData());
      setErrors([]);
    }
  }, []);

  const setSelectedPatientId = useCallback((id: string) => {
    update("_selectedPatientId", id);
  }, [update]);

  return {
    data,
    errors,
    update,
    updateMultiple,
    setTab,
    toggleExam,
    toggleExamCategory,
    selectedCount,
    handlePrint,
    handleSave,
    handleClear,
    setSelectedPatientId,
  };
}
