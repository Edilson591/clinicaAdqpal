import type { RefObject } from "react";
import { CharBoxGrid } from "./CharBoxGrid";
import { DateBoxRow } from "./DateBoxRow";
import {
  SearchableSelectGroup,
  type SearchableOption,
} from "../../components/ui/SearchableSelect";
import {
  type ApacData,
  CNS_LENGTH,
  PROC_LENGTH,
  PROC_PRIMARY_LENGTH,
  SEC_PROC_ROWS,
} from "../../hooks/useApacLaudoPage";

interface ApacFormProps {
  data: ApacData;
  formRef: RefObject<HTMLDivElement | null>;
  update: <K extends keyof ApacData>(key: K, value: ApacData[K]) => void;
  updateSecProc: (
    index: number,
    field: "code" | "nome" | "qtde",
    value: string[] | string,
  ) => void;
  procedureOptions: SearchableOption[];
  cidOptions: SearchableOption[];
  onProcedureSelect: (codigo: string) => void;
  onCidSelect: (codigo: string) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white text-center font-bold text-[10pt] py-0.5 shrink-0">
      {children}
    </div>
  );
}

export function ApacForm({
  data,
  formRef,
  update,
  updateSecProc,
  procedureOptions,
  cidOptions,
  onProcedureSelect,
  onCidSelect
}: ApacFormProps) {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-[#E2E8F0] dark:border-[#334155] p-3 sm:p-6 overflow-hidden">
      <div className="max-h-[calc(100dvh-18rem)] w-full overflow-auto print:max-h-none print:overflow-visible">
        <div className="flex min-w-max justify-center pb-2 print:min-w-0 print:pb-0">
        <div
          ref={formRef}
          id="apac-form"
          className="apac-page w-[794px] max-w-none shrink-0 p-[3mm] bg-white text-[10pt] font-sans flex flex-col shadow-sm overflow-hidden print:w-full print:shrink"
        >
          {/* HEADER SUS */}
          <div className="flex border border-black shrink-0">
            <div className="flex flex-row items-center border-r border-black px-1.5 py-0.75 gap-1.5 shrink-0">
              <div className="border-2 border-black font-bold text-[13pt] px-1.25 py-0.5 leading-none">
                SUS
              </div>
              <div className="flex flex-row gap-2 text-[7pt] leading-[1.4]">
                <div className="whitespace-nowrap">
                  Sistema
                  <br />
                  Único de
                  <br />
                  Saúde
                </div>
                <div className="whitespace-nowrap">
                  Ministério
                  <br />
                  da
                  <br />
                  Saúde
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-center font-bold text-[11pt] px-2 py-1 leading-[1.4]">
              <em>
                LAUDO PARA SOLICITAÇÃO/AUTORIZAÇÃO DE
                <br />
                PROCEDIMENTO AMBULATORIAL
              </em>
            </div>
            <div className="text-[7pt] italic px-1 pt-0.75 border-l border-black min-w-10.5 text-right whitespace-nowrap shrink-0">
              fls.1/2
            </div>
          </div>

          {/* IDENTIFICAÇÃO DO ESTABELECIMENTO DE SAÚDE (SOLICITANTE) */}
          <SectionTitle>
            IDENTIFICAÇÃO DO ESTABELECIMENTO DE SAÚDE (SOLICITANTE)
          </SectionTitle>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="flex-4 border-r border-black flex flex-col">
              <div className="field-label">
                1 - NOME DO ESTABELECIMENTO DE SAÚDE SOLICITANTE
              </div>
              <input
                type="text"
                value={data.f1_nome_estab}
                onChange={(e) => update("f1_nome_estab", e.target.value)}
                className="apac-input"
              />
            </div>
            <div className="flex-1 max-w-22.5 flex flex-col">
              <div className="field-label">2 - CNES</div>
              <input
                type="text"
                value={data.f2_cnes}
                onChange={(e) => update("f2_cnes", e.target.value)}
                className="apac-input"
              />
            </div>
          </div>

          {/* IDENTIFICAÇÃO DO PACIENTE */}
          <SectionTitle>IDENTIFICAÇÃO DO PACIENTE</SectionTitle>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="flex-5 border-r border-black flex flex-col">
              <div className="field-label">3 - NOME DO PACIENTE</div>
              <input
                type="text"
                value={data.f3_nome_paciente}
                onChange={(e) => update("f3_nome_paciente", e.target.value)}
                className="apac-input text-[11.5pt]"
              />
            </div>
            <div className="min-w-14.5 shrink-0 border-r border-black flex flex-col">
              <div className="field-label">4 - SEXO</div>
              <div className="flex gap-1 px-0.75 py-0.5 items-center flex-1">
                <label className="flex items-center gap-0.5 text-[8.5pt] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.f4_sexo === "mas"}
                    onChange={() => update("f4_sexo", "mas")}
                    className="apac-checkbox"
                  />{" "}
                  Mas.
                </label>
                <label className="flex items-center gap-0.5 text-[8.5pt] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.f4_sexo === "fem"}
                    onChange={() => update("f4_sexo", "fem")}
                    className="apac-checkbox"
                  />{" "}
                  Fem.
                </label>
              </div>
            </div>
            <div className="max-w-21.25 flex flex-col">
              <div className="field-label">5 - Nº DO PRONTUÁRIO</div>
              <input
                type="text"
                value={data.f5_prontuario}
                onChange={(e) => update("f5_prontuario", e.target.value)}
                className="apac-input text-[9.5pt]"
              />
            </div>
          </div>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="flex-3 border-r border-black flex flex-col">
              <div className="field-label">
                6 - CARTÃO NACIONAL DE SAÚDE (CNS)
              </div>
              <CharBoxGrid
                values={data.f6_cns}
                onChange={(v) => update("f6_cns", v)}
                length={CNS_LENGTH}
                className="flex px-0.5 py-0.5 gap-px flex-wrap items-center flex-1"
                boxClassName="apac-box"
              />
            </div>
            <div className="flex-[1.5] border-r border-black flex flex-col">
              <div className="field-label">7 - DATA DE NASCIMENTO</div>
              <DateBoxRow
                values={data.dn}
                onChange={(v) => update("dn", v)}
                length={8}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="field-label">8 - RAÇA/COR</div>
              <input
                type="text"
                value={data.f8_raca}
                onChange={(e) => update("f8_raca", e.target.value)}
                className="apac-input text-[9.5pt]"
              />
            </div>
            <div className="flex-1 flex flex-col border-l border-black">
              <div className="field-label">8.1 - ETNIA</div>
              <input
                type="text"
                value={data.f8_etnia}
                onChange={(e) => update("f8_etnia", e.target.value)}
                className="apac-input text-[9.5pt]"
              />
            </div>
          </div>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="flex-3 border-r border-black flex flex-col">
              <div className="field-label">9 - NOME DA MÃE</div>
              <input
                type="text"
                value={data.f9_mae}
                onChange={(e) => update("f9_mae", e.target.value)}
                className="apac-input"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex gap-1 items-end px-0.5 pt-px shrink-0">
                <span className="text-[7pt]">DDD</span>
                <span className="text-[7pt]">
                  10 - TELEFONE DE CONTATO &nbsp; Nº DO TELEFONE
                </span>
              </div>
              <div className="flex gap-0.75 px-0.5 pb-0.5 items-center flex-1">
                <input
                  type="text"
                  maxLength={2}
                  value={data.f10_ddd}
                  onChange={(e) =>
                    update(
                      "f10_ddd",
                      e.target.value.replace(/\D/g, "").slice(0, 2),
                    )
                  }
                  className="apac-tel-input"
                />
                <input
                  type="text"
                  value={data.f10_tel}
                  onChange={(e) => update("f10_tel", e.target.value)}
                  className="apac-tel-input flex-1"
                />
              </div>
            </div>
          </div>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="flex-3 border-r border-black flex flex-col">
              <div className="field-label">11 - NOME DO RESPONSÁVEL</div>
              <input
                type="text"
                value={data.f11_responsavel}
                onChange={(e) => update("f11_responsavel", e.target.value)}
                className="apac-input"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex gap-1 items-end px-0.5 pt-px shrink-0">
                <span className="text-[7pt]">DDD</span>
                <span className="text-[7pt]">
                  12 - TELEFONE DE CONTATO &nbsp; Nº DO TELEFONE
                </span>
              </div>
              <div className="flex gap-0.75 px-0.5 pb-0.5 items-center flex-1">
                <input
                  type="text"
                  maxLength={2}
                  value={data.f12_ddd}
                  onChange={(e) =>
                    update(
                      "f12_ddd",
                      e.target.value.replace(/\D/g, "").slice(0, 2),
                    )
                  }
                  className="apac-tel-input"
                />
                <input
                  type="text"
                  value={data.f12_tel}
                  onChange={(e) => update("f12_tel", e.target.value)}
                  className="apac-tel-input flex-1"
                />
              </div>
            </div>
          </div>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="flex-1 flex flex-col">
              <div className="field-label">13 - ENDEREÇO (RUA, Nº, BAIRRO)</div>
              <input
                type="text"
                value={data.f13_endereco}
                onChange={(e) => update("f13_endereco", e.target.value)}
                className="apac-input text-[11.5pt]"
              />
            </div>
          </div>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="flex-3 border-r border-black flex flex-col">
              <div className="field-label">14 - MUNICÍPIO DE RESIDÊNCIA</div>
              <input
                type="text"
                value={data.f14_municipio}
                onChange={(e) => update("f14_municipio", e.target.value)}
                className="apac-input"
              />
            </div>
            <div className="flex-[1.2] border-r border-black flex flex-col">
              <div className="field-label">15 - CÓD. IBGE MUNICÍPIO</div>
              <input
                type="text"
                value={data.f15_ibge}
                onChange={(e) => update("f15_ibge", e.target.value)}
                className="apac-input text-[9.5pt]"
              />
            </div>
            <div className="max-w-10 border-r border-black flex flex-col">
              <div className="field-label">16 - UF</div>
              <input
                type="text"
                maxLength={2}
                value={data.f16_uf}
                onChange={(e) => update("f16_uf", e.target.value.toUpperCase())}
                className="apac-input text-[9.5pt]"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="field-label">17 - CEP</div>
              <input
                type="text"
                value={data.f17_cep}
                onChange={(e) => update("f17_cep", e.target.value)}
                className="apac-input text-[9.5pt]"
              />
            </div>
          </div>

          {/* PROCEDIMENTO SOLICITADO */}
          <div className="mb-2 no-print">
            <SearchableSelectGroup
              label="Buscar Procedimento SUS"
              placeholder="Digite o código ou nome do procedimento..."
              options={procedureOptions}
              value={data.f18_proc.join("").trim()}
              onChange={onProcedureSelect}
            />
          </div>
          <SectionTitle>PROCEDIMENTO SOLICITADO</SectionTitle>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="max-w-52 border-r border-black flex flex-col">
              <div className="field-label">
                18 - CÓDIGO DO PROCEDIMENTO PRINCIPAL
              </div>
              <CharBoxGrid
                values={data.f18_proc}
                onChange={(v) => update("f18_proc", v)}
                length={PROC_PRIMARY_LENGTH}
                className="flex px-0.5 py-0.5 gap-px items-center flex-1"
                boxClassName="apac-proc-box"
              />
            </div>
            <div className="flex-4 border-r border-black flex flex-col">
              <div className="field-label">
                19 - NOME DO PROCEDIMENTO PRINCIPAL
              </div>
              <input
                type="text"
                value={data.f19_proc_nome}
                onChange={(e) => update("f19_proc_nome", e.target.value)}
                className="apac-input"
              />
            </div>
            <div className="max-w-12 flex flex-col">
              <div className="field-label">20 - QTDE.</div>
              <input
                type="text"
                value={data.f20_qtde}
                onChange={(e) => update("f20_qtde", e.target.value)}
                className="apac-input text-[9.5pt]"
              />
            </div>
          </div>

          {/* PROCEDIMENTOS SECUNDÁRIOS */}
          <SectionTitle>PROCEDIMENTO(S) SECUNDÁRIO(S)</SectionTitle>
          {data.sec_procs.map((sp, idx) => {
            const [a, b, c] = SEC_PROC_ROWS[idx];
            return (
              <div
                key={idx}
                className="flex border-l border-r border-b border-black shrink-0"
              >
                <div className="max-w-44 border-r border-black flex flex-col">
                  <div className="field-label">
                    {a} - CÓDIGO DO PROCEDIMENTO SECUNDÁRIO
                  </div>
                  <CharBoxGrid
                    values={sp.code}
                    onChange={(v) => updateSecProc(idx, "code", v)}
                    length={PROC_LENGTH}
                    className="flex px-0.5 py-0.5 gap-px items-center flex-1"
                    boxClassName="apac-small-box"
                  />
                </div>
                <div className="flex-4 border-r border-black flex flex-col">
                  <div className="field-label">
                    {b} - NOME DO PROCEDIMENTO SECUNDÁRIO
                  </div>
                  <input
                    type="text"
                    value={sp.nome}
                    onChange={(e) => updateSecProc(idx, "nome", e.target.value)}
                    className="apac-input text-[9.5pt]"
                  />
                </div>
                <div className="max-w-12 flex flex-col">
                  <div className="field-label">{c} - QTDE.</div>
                  <input
                    type="text"
                    value={sp.qtde}
                    onChange={(e) => updateSecProc(idx, "qtde", e.target.value)}
                    className="apac-input text-[9.5pt]"
                  />
                </div>
              </div>
            );
          })}

          <div className="mb-2 no-print">
            <SearchableSelectGroup
              label="CID / Doença"
              placeholder="Digite o código CID ou o nome da doença..."
              options={cidOptions}
              value={data.f37_cid_principal}
              onChange={onCidSelect}
            />
          </div>
          {/* JUSTIFICATIVA */}
          <SectionTitle>
            JUSTIFICATIVA DO(S) PROCEDIMENTO(S) SOLICITADO(S)
          </SectionTitle>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="flex-2 border-r border-black flex flex-col">
              <div className="field-label">36 - DESCRIÇÃO DO DIAGNÓSTICO</div>
              <input
                type="text"
                value={data.f36_diagnostico}
                onChange={(e) => update("f36_diagnostico", e.target.value)}
                className="apac-input"
              />
            </div>
            <div className="flex-[0.8] border-r border-black flex flex-col">
              <div className="field-label">37-CID10 PRINCIPAL</div>
              <input
                type="text"
                value={data.f37_cid_principal}
                onChange={(e) => update("f37_cid_principal", e.target.value)}
                className="apac-input"
              />
            </div>
            <div className="flex-[0.8] border-r border-black flex flex-col">
              <div className="field-label">38-CID10 SECUNDÁRIO</div>
              <input
                type="text"
                value={data.f38_cid_sec}
                onChange={(e) => update("f38_cid_sec", e.target.value)}
                className="apac-input text-[9.5pt]"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="field-label">39-CID10 CAUSAS ASSOCIADAS</div>
              <input
                type="text"
                value={data.f39_cid_assoc}
                onChange={(e) => update("f39_cid_assoc", e.target.value)}
                className="apac-input text-[9.5pt]"
              />
            </div>
          </div>

          {/* OBSERVAÇÕES — preenche o espaço restante */}
          <div className="flex border-l border-r border-b border-black flex-1 min-h-0">
            <div className="flex-1 flex flex-col">
              <div className="field-label">40 - OBSERVAÇÕES</div>
              <textarea
                value={data.f40_obs}
                onChange={(e) => update("f40_obs", e.target.value)}
                className="apac-textarea"
              />
            </div>
          </div>

          {/* SOLICITAÇÃO */}
          <SectionTitle>SOLICITAÇÃO</SectionTitle>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="flex-2 border-r border-black flex flex-col">
              <div className="field-label">
                41 - NOME DO PROFISSIONAL SOLICITANTE
              </div>
              <input
                type="text"
                value={data.f41_prof_sol}
                onChange={(e) => update("f41_prof_sol", e.target.value)}
                className="apac-input"
              />
            </div>
            <div className="max-w-35 border-r border-black flex flex-col">
              <div className="field-label">42-DATA DA SOLICITAÇÃO</div>
              <DateBoxRow
                values={data.ds}
                onChange={(v) => update("ds", v)}
                length={6}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="field-label">
                45-ASSINATURA E CARIMBO (Nº REGISTRO DO CONSELHO)
              </div>
            </div>
          </div>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="max-w-19.5 border-r border-black flex flex-col">
              <div className="field-label">43 - DOCUMENTO</div>
              <div className="flex gap-1 px-0.75 py-0.5 items-center text-[8.5pt] flex-1">
                <label className="flex items-center gap-px cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.f43_doc === "cns"}
                    onChange={() => update("f43_doc", "cns")}
                    className="apac-checkbox"
                  />{" "}
                  CNS
                </label>
                <label className="flex items-center gap-px cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.f43_doc === "cpf"}
                    onChange={() => update("f43_doc", "cpf")}
                    className="apac-checkbox"
                  />{" "}
                  CPF
                </label>
              </div>
            </div>
            <div className="flex-2 flex flex-col">
              <div className="field-label">
                44 - Nº DOCUMENTO (CNS/CPF) DO PROFISSIONAL SOLICITANTE
              </div>
              <CharBoxGrid
                values={data.f44_doc}
                onChange={(v) => update("f44_doc", v)}
                length={CNS_LENGTH}
                className="flex px-0.5 py-0.5 gap-px flex-wrap items-center flex-1"
                boxClassName="apac-box"
              />
            </div>
          </div>

          {/* AUTORIZAÇÃO */}
          <SectionTitle>AUTORIZAÇÃO</SectionTitle>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="flex-2 border-r border-black flex flex-col">
              <div className="field-label">
                46 - NOME DO PROFISSIONAL AUTORIZADOR
              </div>
              <input
                type="text"
                value={data.f46_prof_aut}
                onChange={(e) => update("f46_prof_aut", e.target.value)}
                className="apac-input"
              />
            </div>
            <div className="flex-1 border-r border-black flex flex-col">
              <div className="field-label">47 - CÓD. ÓRGÃO EMISSOR</div>
              <input
                type="text"
                value={data.f47_orgao}
                onChange={(e) => update("f47_orgao", e.target.value)}
                className="apac-input text-[9.5pt]"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="field-label">52 - Nº DA AUTORIZAÇÃO (APAC)</div>
              <input
                type="text"
                value={data.f52_apac}
                onChange={(e) => update("f52_apac", e.target.value)}
                className="apac-input text-[9.5pt]"
              />
            </div>
          </div>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="max-w-19.5 border-r border-black flex flex-col">
              <div className="field-label">48 - DOCUMENTO</div>
              <div className="flex gap-1 px-0.75 py-0.5 items-center text-[8.5pt] flex-1">
                <label className="flex items-center gap-px cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.f48_doc === "cns"}
                    onChange={() => update("f48_doc", "cns")}
                    className="apac-checkbox"
                  />{" "}
                  CNS
                </label>
                <label className="flex items-center gap-px cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.f48_doc === "cpf"}
                    onChange={() => update("f48_doc", "cpf")}
                    className="apac-checkbox"
                  />{" "}
                  CPF
                </label>
              </div>
            </div>
            <div className="flex-2 flex flex-col">
              <div className="field-label">
                49 - Nº DOCUMENTO (CNS/CPF) DO PROFISSIONAL AUTORIZADOR
              </div>
              <CharBoxGrid
                values={data.f49_doc}
                onChange={(v) => update("f49_doc", v)}
                length={CNS_LENGTH}
                className="flex px-0.5 py-0.5 gap-px flex-wrap items-center flex-1"
                boxClassName="apac-box"
              />
            </div>
          </div>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="max-w-23.75 border-r border-black flex flex-col">
              <div className="field-label">50-DATA DA AUTORIZAÇÃO</div>
              <DateBoxRow
                values={data.da}
                onChange={(v) => update("da", v)}
                length={6}
              />
            </div>
            <div className="flex-2 border-r border-black flex flex-col">
              <div className="field-label">
                51 - ASSINATURA E CARIMBO (Nº DO REGISTRO DO CONSELHO)
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="field-label">
                53 - PERÍODO DE VALIDADE DA APAC
              </div>
              <DateBoxRow
                values={Array(8).fill("")}
                onChange={() => {}}
                length={8}
              />
            </div>
          </div>

          {/* EXECUTANTE */}
          <SectionTitle>
            IDENTIFICAÇÃO DO ESTABELECIMENTO DE SAÚDE (EXECUTANTE)
          </SectionTitle>
          <div className="flex border-l border-r border-b border-black shrink-0">
            <div className="flex-4 border-r border-black flex flex-col">
              <div className="field-label">
                54 – NOME FANTASIA DO ESTABELECIMENTO DE SAÚDE EXECUTANTE
              </div>
              <input
                type="text"
                value={data.f54_executante}
                onChange={(e) => update("f54_executante", e.target.value)}
                className="apac-input"
              />
            </div>
            <div className="flex-1 max-w-22.5 flex flex-col">
              <div className="field-label">55 - CNES</div>
              <input
                type="text"
                value={data.f55_cnes_exec}
                onChange={(e) => update("f55_cnes_exec", e.target.value)}
                className="apac-input"
              />
            </div>
          </div>

          <div className="text-[5pt] text-[#555] pt-px shrink-0">
            01-Laudo Solic. Proc. Amb Atualizada_21-10-10.vsd
          </div>
        </div>
        </div>
      </div>

      <style>{`
        .apac-input {
          border: none !important;
          outline: none !important;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11pt;
          font-weight: bold;
          padding: 1px 2px;
          background: transparent;
          width: 100%;
          flex: 1;
        }
        .apac-input:focus {
          background: #fffde7;
        }
        .apac-textarea {
          border: none;
          outline: none;
          width: 100%;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10.5pt;
          font-weight: bold;
          resize: none;
          background: transparent;
          padding: 2px;
          flex: 1;
          min-height: 0;
        }
        .apac-textarea:focus {
          background: #fffde7;
        }
        .apac-checkbox {
          width: 10px !important;
          height: 10px !important;
          cursor: pointer;
        }
        .apac-box {
          width: 16px;
          height: 17px;
          border: 1px solid #000;
          text-align: center;
          font-size: 11pt;
          font-weight: bold;
          outline: none;
          padding: 0;
          background: transparent;
          flex-shrink: 0;
        }
        .apac-box:focus {
          background: #fffde7;
        }
        .apac-proc-box {
          border: 1px solid #000;
          width: 19px;
          height: 19px;
          text-align: center;
          font-size: 11pt;
          font-weight: bold;
          outline: none;
          padding: 0;
          background: transparent;
          flex-shrink: 0;
        }
        .apac-proc-box:focus {
          background: #fffde7;
        }
        .apac-small-box {
          border: 1px solid #000;
          width: 15px;
          height: 15px;
          text-align: center;
          font-size: 10pt;
          outline: none;
          padding: 0;
          background: transparent;
          flex-shrink: 0;
        }
        .apac-small-box:focus {
          background: #fffde7;
        }
        .apac-tel-input {
          border: 1px solid #555;
          height: 15px;
          font-size: 9pt;
          outline: none;
          background: transparent;
        }
        .apac-tel-input:focus {
          background: #fffde7;
        }
        .field-label {
          font-size: 8.5pt;
          padding: 1px 2px 0 2px;
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          flex-shrink: 0;
        }
        @media print {
          input:focus, textarea:focus { background: transparent !important; }
        }
      `}</style>
    </div>
  );
}
