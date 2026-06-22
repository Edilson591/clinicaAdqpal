import { useCallback, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Header } from "../../components/Dashboard/Header";
import { useApacLaudoPage, type ApacData } from "../../hooks/useApacLaudoPage";
import { usePatient } from "../../hooks/usePatients";
import { usePatientSearch } from "../../hooks/usePatientSearch";
import { useDoctors } from "../../hooks/useUsers";
import { SearchableSelectGroup } from "../../components/ui/SearchableSelect";
import { ApacToolbar } from "./ApacToolbar";
import { ApacForm } from "./ApacForm";
import type { PatientResponse, UserResponse } from "../../types/api";
import cids from "../../../public/cid10.json";
import type { CID10Record } from "../../services/cid";

function parseDateToBoxes(dateStr: string | null): string[] {
  if (!dateStr) return Array(8).fill("");
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return Array(8).fill("");
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear());
  return (day + month + year).split("");
}

function parsePhone(phone: string | null): { ddd: string; number: string } {
  if (!phone) return { ddd: "", number: "" };
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 2) return { ddd: digits, number: "" };
  return { ddd: digits.slice(0, 2), number: digits.slice(2) };
}

function fillFromPatient(p: PatientResponse) {
  const phone = parsePhone(p.phone);
  const saved = localStorage.getItem("apac_laudo");
  let parsed: Partial<ApacData> = {};
  try {
    parsed = saved ? (JSON.parse(saved) as Partial<ApacData>) : {};
  } catch {
    parsed = {};
  }
  return {
    f3_nome_paciente: p.name ?? "",
    f4_sexo: (p.gender === "M" ? "mas" : p.gender === "F" ? "fem" : null) as
      | "mas"
      | "fem"
      | null,
    f5_prontuario: parsed.f5_prontuario ?? "",
    f6_cns: parsed.f6_cns ?? Array(15).fill(""),
    dn: parseDateToBoxes(p.dateOfBirth),
    f8_raca: "",
    f8_etnia: "",
    f9_mae: "",
    f10_ddd: phone.ddd,
    f10_tel: phone.number,
    f11_responsavel: "",
    f12_ddd: "",
    f12_tel: "",
    f13_endereco: [p.street, p.streetNumber, p.additionalInfo]
      .filter(Boolean)
      .join(", "),
    f14_municipio: p.city ?? "SÃO MIGUEL DOS CAMPOS / AL",
    f15_ibge: "",
    f16_uf: p.state ?? "AL",
    f17_cep: p.zipCode ?? "",
    f18_proc: parsed.f18_proc ?? Array(10).fill(""),
    f19_proc_nome: parsed.f19_proc_nome ?? "",
    f20_qtde: "",
    f36_diagnostico: "",
    f37_cid_principal: "",
    f38_cid_sec: "",
    f39_cid_assoc: "",
    f40_obs: "",
  };
}

function fillFromDoctor(d: UserResponse) {
  const cpfDigits = (d.cpf ?? "").replace(/\D/g, "").split("");
  return {
    f41_prof_sol: d.username ?? "",
    ds: Array(6).fill(""),
    f43_doc: "cpf" as const,
    f44_doc:
      cpfDigits.length === 11
        ? cpfDigits.concat(Array(4).fill("")).slice(0, 15)
        : Array(15).fill(""),
  };
}

export default function ApacLaudoPage() {
  const {
    data,
    errors,
    formRef,
    update,
    updateSecProc,
    handlePrint,
    handleClear,
    susProcedures,
  } = useApacLaudoPage();

  const [selectedPatientId, setSelectedPatientId] = useState(
    data._selectedPatientId || "",
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    data._selectedDoctorId || "",
  );

  const { options: patientOptions, setQuery: setPatientQuery } =
    usePatientSearch();
  const { data: doctors = [] } = useDoctors();

  const { data: patient } = usePatient(selectedPatientId);

  const doctor = doctors.find((d) => d.id === selectedDoctorId);

  const cidRecord = (cids as CID10Record[]).map((item) => ({
    value: item.codigo,
    label: `${item.codigo} - ${item.descricao}`,
  }));

  useEffect(() => {
    if (!patient) return;
    const updates = fillFromPatient(patient);
    for (const [key, value] of Object.entries(updates)) {
      (update as (k: string, v: unknown) => void)(key, value);
    }
  }, [patient, update]);

  useEffect(() => {
    if (!doctor) return;
    const updates = fillFromDoctor(doctor);
    for (const [key, value] of Object.entries(updates)) {
      (update as (k: string, v: unknown) => void)(key, value);
    }
  }, [doctor, update]);

  const handlePatientChange = useCallback(
    (id: string) => {
      setSelectedPatientId(id);
      update("_selectedPatientId", id);
    },
    [update],
  );

  const handleDoctorChange = useCallback(
    (id: string) => {
      setSelectedDoctorId(id);
      update("_selectedDoctorId", id);
    },
    [update],
  );

  const doctorOptions = doctors.map((d) => ({
    value: d.id,
    label: d.username,
  }));

  const procedureOptions = (susProcedures ?? []).map((p) => ({
    value: p.codigo,
    label: `${p.codigo} - ${p.nome}`,
  }));

  const handleProcedureSelect = useCallback(
    (codigo: string) => {
      const proc = (susProcedures ?? []).find((p) => p.codigo === codigo);

      if (!proc) return;
      const chars = proc.codigo.padEnd(10, " ").split("").slice(0, 10);
      update("f18_proc", chars);
      update("f19_proc_nome", proc.nome);
    },
    [susProcedures, update],
  );
  const handleCidSelect = useCallback(
    (codigo: string) => {
      const proc = (cidRecord ?? []).find((p) => p.value === codigo);

      if (!proc) return;
      update("f37_cid_principal", proc.value);
      update("f36_diagnostico", proc.label.replace(`${proc.value} - `, ""));
    },
    [cidRecord, update],
  );

  return (
    <main className="flex-1 relative dark:bg-[#0F172A] overflow-y-auto">
      <div className="absolute inset-0 bg-[url('/bg-fundo.jpeg')] bg-no-repeat bg-cover bg-center opacity-10 z-[-1] dark:bg-none" />
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <Header />

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              Laudo APAC
            </h1>
            <p className="text-sm text-[#94A3B8] dark:text-[#64748B] mt-1">
              Laudo para Solicitação/Autorização de Procedimento Ambulatorial -
              SUS
            </p>
          </div>
          <ApacToolbar onPrint={handlePrint} onClear={handleClear} />
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">
                Corrija os erros abaixo antes de imprimir:
              </p>
              <ul className="list-disc pl-5 space-y-0.5">
                {errors.map((err, i) => (
                  <li
                    key={i}
                    className="text-sm text-red-600 dark:text-red-300"
                  >
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Seleção de Paciente e Médico */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-[#E2E8F0] dark:border-[#334155] p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchableSelectGroup
              label="Paciente"
              placeholder="Buscar paciente pelo nome..."
              options={patientOptions}
              value={selectedPatientId}
              onChange={handlePatientChange}
              onSearchChange={setPatientQuery}
            />
          </div>
          <div className="flex-1">
            <SearchableSelectGroup
              label="Médico Solicitante"
              placeholder="Selecionar médico..."
              options={doctorOptions}
              value={selectedDoctorId}
              onChange={handleDoctorChange}
            />
          </div>
        </div>

        <ApacForm
          data={data}
          formRef={formRef}
          update={update}
          cidOptions={cidRecord}
          updateSecProc={updateSecProc}
          procedureOptions={procedureOptions}
          onProcedureSelect={handleProcedureSelect}
          onCidSelect={handleCidSelect}
        />
      </div>
    </main>
  );
}
