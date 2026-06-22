import { DatePickerInput } from "../../components/ui/DatePickerInput";
import { InputGroup } from "../../components/ui/Input";
import { VoiceTextarea } from "../../components/ui/VoiceTextarea";
import { type ReceituarioData, EXAMS } from "../../hooks/useReceituarioPage";

interface ReceituarioFormProps {
  data: ReceituarioData;
  update: <K extends keyof ReceituarioData>(
    key: K,
    value: ReceituarioData[K],
  ) => void;
  toggleExam: (exam: string) => void;
  toggleExamCategory: (catIndex: number) => void;
  selectedCount: number;
}

function TabContent({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  if (!show) return null;
  return <div className="p-5">{children}</div>;
}

export function ReceituarioForm({
  data,
  update,
  toggleExam,
  toggleExamCategory,
  selectedCount,
}: ReceituarioFormProps) {
  const tab = data.tab;

  const s = (key: keyof ReceituarioData) => ({
    value: data[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      update(key, e.target.value as never),
  });

  const readOnlyProps = (value: string) => ({
    value,
    readOnly: true,
    className: "bg-[#F8FAFC] border-[#BBF7D0] text-[#166534] cursor-default",
  });

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-[#E2E8F0] dark:border-[#334155]">
      <div className="p-5">
        {/* === EXAMES === */}
        <TabContent show={tab === "exames"}>
          <div className="flex flex-col gap-4 max-w-2xl">
            <InputGroup
              label="Paciente"
              inputProps={{
                placeholder: "Nome completo do paciente",
                className: "bg-[#F8FAFC]",
                ...s("examPatient"),
              }}
            />
            <div className="bg-[#f4f8f4] dark:bg-[#1a2a1f] border-l-4 border-[#1a3a2a] dark:border-[#38A169] rounded p-4">
              <InputGroup
                label="Justificativa"
                inputProps={{
                  placeholder: "Ex: Rotina",
                  className: "bg-[#F8FAFC]",
                  ...s("examJustificativa"),
                }}
              />
            </div>
            <div className="bg-[#F8FAFC] dark:bg-[#263548] border border-[#D9E5DA] dark:border-[#334155] rounded-lg p-4">
              <InputGroup
                label="Outros exames"
                helperText="Campo opcional para solicitar um exame que não aparece na lista abaixo."
                inputProps={{
                  placeholder: "Digite o nome do exame, se não estiver listado",
                  className: "bg-white dark:bg-[#1E293B]",
                  ...s("examOther"),
                }}
              />
            </div>
            <p className="text-sm text-[#5a6a5a] dark:text-[#94A3B8]">
              <strong className="text-[#38A169]">{selectedCount}</strong> exame
              {selectedCount !== 1 ? "s" : ""} selecionado
              {selectedCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {EXAMS.map((group, gi) => (
              <div
                key={gi}
                className="border border-[#cdd8cd] dark:border-[#334155] rounded-lg overflow-hidden"
              >
                <div className="bg-[#1a3a2a] dark:bg-[#1E3A2F] text-[#e8f0e8] px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>{group.cat}</span>
                  <button
                    onClick={() => toggleExamCategory(gi)}
                    className="text-[10px] text-[#a0c8a8] dark:text-[#38A169] hover:text-white dark:hover:text-white bg-transparent border-none cursor-pointer font-bold uppercase"
                  >
                    {group.items.every((i) => data.examSelected.includes(i))
                      ? "Nenhum"
                      : "Todos"}
                  </button>
                </div>
                <div className="py-1">
                  {group.items.map((exam) => (
                    <label
                      key={exam}
                      onClick={() => toggleExam(exam)}
                      className="flex items-center gap-2 px-3.5 py-1.5 cursor-pointer hover:bg-[#f0f5f0] dark:hover:bg-[#263548]"
                    >
                      <input
                        type="checkbox"
                        checked={data.examSelected.includes(exam)}
                        onChange={() => {}}
                        className="w-3.5 h-3.5 accent-[#1a5a3a] dark:accent-[#38A169] shrink-0 cursor-pointer"
                      />
                      <span className="text-sm text-[#2a3a2a] dark:text-[#CBD5E1] cursor-pointer">
                        {exam}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabContent>

        {/* === RECEITA C/ ASSINATURA === */}
        <TabContent show={tab === "receita_com"}>
          <div className="flex flex-col gap-4 max-w-2xl">
            <InputGroup
              label="Paciente"
              inputProps={{
                placeholder: "Nome completo do paciente",
                className: "bg-[#F8FAFC]",
                ...s("recComPatient"),
              }}
            />
            {/* <InputGroup
              label="Data"
              inputProps={{
                placeholder: "Ex: 22 de Maio de 2026",
                className: "bg-[#F8FAFC]",
                ...s("recComData"),

              }}
            /> */}
            <DatePickerInput
              label="Data"
              selected={
                data.recComData ? new Date(data.recComData) : new Date()
              }
              onChange={(date) =>
                update(
                  "recComData",
                  date ? (date.toISOString() as never) : ("" as never),
                )
              }
            />

            <VoiceTextarea
              label="Medicamentos"
              placeholder="Ex: Amoxicilina 500mg — 1 cápsula 3x ao dia por 7 dias"
              className="bg-[#F8FAFC] resize-none"
              rows={4}
              currentValue={data.recComMed}
              onTranscriptAppend={(val) => update("recComMed", val)}
              {...s("recComMed")}
            />
            <InputGroup
              label="Observações"
              inputProps={{
                placeholder: "Instruções adicionais (opcional)",
                className: "bg-[#F8FAFC]",
                ...s("recComObs"),
              }}
            />
          </div>
        </TabContent>

        {/* === RECEITA S/ ASSINATURA === */}
        <TabContent show={tab === "receita_sem"}>
          <div className="flex flex-col gap-4 max-w-2xl">
            <InputGroup
              label="Paciente"
              inputProps={{
                placeholder: "Nome completo do paciente",
                className: "bg-[#F8FAFC]",
                ...s("recSemPatient"),
              }}
            />

            <DatePickerInput
              label="Data"
              selected={
                data.recSemData ? new Date(data.recSemData) : new Date()
              }
              onChange={(date) =>
                update(
                  "recSemData",
                  date ? (date.toISOString() as never) : ("" as never),
                )
              }
            />

            {/* <InputGroup
              label="Medicamentos"
              textarea
              textareaProps={{
                placeholder:
                  "Ex: Amoxicilina 500mg — 1 cápsula 3x ao dia por 7 dias",
                className: "bg-[#F8FAFC] resize-none min-h-[120px]",
                ...s("recSemMed"),
              }}
            /> */}
            <VoiceTextarea
              label="Medicamentos"
              placeholder="Ex: Amoxicilina 500mg — 1 cápsula 3x ao dia por 7 dias"
              className="bg-[#F8FAFC] resize-none"
              rows={4}
              currentValue={data.recSemMed}
              onTranscriptAppend={(val) => update("recSemMed", val)}
              {...s("recSemMed")}
            />
            <VoiceTextarea
              label="Observações"
              placeholder="Instruções adicionais (opcional)"
              className="bg-[#F8FAFC] resize-none"
              rows={4}
              currentValue={data.recSemObs}
              onTranscriptAppend={(val) => update("recSemObs", val)}
              {...s("recSemObs")}
            />
          </div>
        </TabContent>

        {/* === CONTROLE ESPECIAL === */}
        <TabContent show={tab === "controle"}>
          <div className="flex flex-col gap-4 max-w-2xl">
            <h3 className="text-sm font-bold text-[#1a3a2a] dark:text-[#38A169] border-b-2 border-[#1a3a2a] dark:border-[#38A169] pb-1.5 mb-2">
              Identificação do Emitente
            </h3>
            <InputGroup
              label="Nome Completo"
              inputProps={readOnlyProps("Luiz Paulo Prezeres")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputGroup
                label="CRM"
                inputProps={readOnlyProps("CRM-AL 9446")}
              />
              <InputGroup
                label="MF"
                inputProps={{
                  placeholder: "MF",
                  className: "bg-[#F8FAFC]",
                  value: "",
                  onChange: () => {},
                  id: "ce-mf",
                }}
              />
              <InputGroup
                label="Nº"
                inputProps={{
                  placeholder: "Nº",
                  className: "bg-[#F8FAFC]",
                  value: "",
                  onChange: () => {},
                  id: "ce-num",
                }}
              />
            </div>
            <InputGroup
              label="Endereço"
              inputProps={readOnlyProps("Praça Dr. José Inácio, 173 - Centro")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup
                label="Cidade"
                inputProps={readOnlyProps("São Miguel dos Campos")}
              />
              <InputGroup label="UF" inputProps={readOnlyProps("AL")} />
            </div>
            <InputGroup
              label="Telefone"
              inputProps={readOnlyProps("(82) 991636096")}
            />
            <h3 className="text-sm font-bold text-[#1a3a2a] dark:text-[#38A169] border-b-2 border-[#1a3a2a] dark:border-[#38A169] pb-1.5 mt-4 mb-2">
              Dados do Paciente
            </h3>
            <InputGroup
              label="Paciente"
              inputProps={{
                placeholder: "Nome completo do paciente",
                className: "bg-[#F8FAFC]",
                ...s("cePacNome"),
              }}
            />
            <InputGroup
              label="Endereço"
              inputProps={{
                placeholder: "Endereço do paciente",
                className: "bg-[#F8FAFC]",
                ...s("cePacEnd"),
              }}
            />
            <VoiceTextarea
              label="Observações"
              placeholder="Instruções adicionais (opcional)"
              className="bg-[#F8FAFC] resize-none"
              rows={4}
              currentValue={data.cePrescricao}
              onTranscriptAppend={(val) => update("cePrescricao", val)}
              {...s("cePrescricao")}
            />
            <h3 className="text-sm font-bold text-[#1a3a2a] dark:text-[#38A169] border-b-2 border-[#1a3a2a] dark:border-[#38A169] pb-1.5 mt-4 mb-2">
              Identificação do Comprador
            </h3>
            <InputGroup
              label="Nome"
              inputProps={{
                placeholder: "Nome do comprador",
                className: "bg-[#F8FAFC]",
                ...s("ceCompNome"),
              }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup
                label="Identidade"
                inputProps={{
                  placeholder: "Nº do documento",
                  className: "bg-[#F8FAFC]",
                  ...s("ceCompIdent"),
                }}
              />
              <InputGroup
                label="Órgão Emissor"
                inputProps={{
                  placeholder: "Ex: SSP/AL",
                  className: "bg-[#F8FAFC]",
                  ...s("ceCompOrgao"),
                }}
              />
            </div>
            <InputGroup
              label="Endereço"
              inputProps={{
                placeholder: "Endereço do comprador",
                className: "bg-[#F8FAFC]",
                ...s("ceCompEnd"),
              }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup
                label="Cidade"
                inputProps={{
                  placeholder: "Cidade",
                  className: "bg-[#F8FAFC]",
                  ...s("ceCompCidade"),
                }}
              />
              <InputGroup
                label="UF"
                inputProps={{
                  placeholder: "UF",
                  className: "bg-[#F8FAFC]",
                  ...s("ceCompUf"),
                }}
              />
            </div>
            <InputGroup
              label="Telefone"
              inputProps={{
                placeholder: "Telefone do comprador",
                className: "bg-[#F8FAFC]",
                ...s("ceCompTel"),
              }}
            />
          </div>
        </TabContent>

        {/* === ENCAMINHAMENTO === */}
        <TabContent show={tab === "encaminhamento"}>
          <div className="flex flex-col gap-4 max-w-2xl">
            <InputGroup
              label="Paciente"
              inputProps={{
                placeholder: "Nome completo do paciente",
                className: "bg-[#F8FAFC]",
                ...s("encPatient"),
              }}
            />
            <InputGroup
              label="Encaminhar para"
              inputProps={{
                placeholder: "Ex: Secretaria Municipal de Saúde",
                className: "bg-[#F8FAFC]",
                ...s("encDest"),
              }}
            />
            <InputGroup
              label="Especialidade"
              inputProps={{
                placeholder: "Ex: Cirurgia Geral, Oftalmologista...",
                className: "bg-[#F8FAFC]",
                ...s("encEspec"),
              }}
            />
            <InputGroup
              label="Médico Solicitado"
              inputProps={{
                placeholder: "Opcional",
                className: "bg-[#F8FAFC]",
                ...s("encMedico"),
              }}
            />
            <InputGroup
              label="Justificativa"
              inputProps={{
                placeholder: "Ex: Avaliação, Colelitiase...",
                className: "bg-[#F8FAFC]",
                ...s("encJust"),
              }}
            />
            <VoiceTextarea
              label="Observações"
              placeholder="Instruções adicionais (opcional)"
              className="bg-[#F8FAFC] resize-none"
              rows={4}
              currentValue={data.encObs}
              onTranscriptAppend={(val) => update("encObs", val)}
              {...s("encObs")}
            />
          </div>
        </TabContent>

        {/* === AUTORIZAÇÃO === */}
        <TabContent show={tab === "autorizacao"}>
          <div className="flex flex-col gap-4 max-w-2xl">
            <InputGroup
              label="Nome"
              inputProps={{
                placeholder: "Nome completo do paciente",
                className: "bg-[#F8FAFC]",
                ...s("autNome"),
              }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup
                label="DN"
                inputProps={{
                  placeholder: "DD/MM/AAAA",
                  className: "bg-[#F8FAFC]",
                  ...s("autDn"),
                }}
              />
              <InputGroup
                label="CPF"
                inputProps={{
                  placeholder: "000.000.000-00",
                  className: "bg-[#F8FAFC]",
                  ...s("autCpf"),
                }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup
                label="RG"
                inputProps={{
                  placeholder: "Nº do RG",
                  className: "bg-[#F8FAFC]",
                  ...s("autRg"),
                }}
              />
              <InputGroup
                label="Cartão SUS"
                inputProps={{
                  placeholder: "000.000.000.000.000",
                  className: "bg-[#F8FAFC]",
                  ...s("autSus"),
                }}
              />
            </div>
            <InputGroup
              label="Tipo de Exame"
              inputProps={{
                placeholder: "Ex: MAPA, Ecocardiograma...",
                className: "bg-[#F8FAFC]",
                ...s("autTipo"),
              }}
            />
            <InputGroup
              label="Autorizador"
              inputProps={readOnlyProps("NAEDJA SILVA MELO")}
            />
            <InputGroup
              label="Cargo"
              inputProps={readOnlyProps("PRESIDENTE - AUTORIZADOR")}
            />
          </div>
        </TabContent>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
