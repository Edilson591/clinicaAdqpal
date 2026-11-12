import { useCallback, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Header } from "../../components/Dashboard/Header";
import { SearchableSelectGroup } from "../../components/ui/SearchableSelect";
import { useAihLaudoPage } from "../../hooks/useAihLaudoPage";
import { usePatient } from "../../hooks/usePatients";
import { usePatientSearch } from "../../hooks/usePatientSearch";
import { useDoctors } from "../../hooks/useUsers";
import type { PatientResponse } from "../../types/api";
import cids from "../../../public/cid10.json";
import type { CID10Record } from "../../services/cid";
import { ApacToolbar } from "./ApacToolbar";
import { AihForm } from "./AihForm";

function formatDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}${month}${date.getUTCFullYear()}`;
}

function patientFields(patient: PatientResponse) {
  const phone = (patient.phone ?? "").replace(/\D/g, "");
  return {
    f5Paciente: patient.name ?? "",
    f6Prontuario: patient.registrationNumber ?? "",
    f8Nascimento: formatDate(patient.dateOfBirth),
    f9Sexo: patient.gender === "M" ? "M" : patient.gender === "F" ? "F" : "",
    f11Ddd: phone.slice(0, 2),
    f11Telefone: phone.slice(2),
    f12Endereco: [patient.street, patient.streetNumber, patient.additionalInfo].filter(Boolean).join(", "),
    f13Municipio: patient.city ?? "SÃO MIGUEL DOS CAMPOS",
    f15Uf: patient.state ?? "AL",
    f16Cep: patient.zipCode ?? "",
  };
}

export default function AihLaudoPage() {
  const { data, errors, formRef, update, handlePrint, handleClear } = useAihLaudoPage();
  const [patientId, setPatientId] = useState(data._selectedPatientId);
  const [doctorId, setDoctorId] = useState(data._selectedDoctorId);
  const { options: patientOptions, setQuery: setPatientQuery, isLoading: patientsLoading } = usePatientSearch();
  const { data: patient } = usePatient(patientId);
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors();
  const doctor = doctors.find((item) => item.id === doctorId);

  useEffect(() => {
    if (!patient) return;
    Object.entries(patientFields(patient)).forEach(([key, value]) => update(key as keyof typeof data, value));
  }, [patient, update]);

  useEffect(() => {
    if (!doctor) return;
    update("f30ProfissionalSolicitante", doctor.username ?? "");
    update("f28DocumentoTipo", "CPF");
    update("f29DocumentoProfissional", doctor.cpf ?? "");
  }, [doctor, update]);

  const handlePatientChange = useCallback((value: string) => {
    setPatientId(value);
    update("_selectedPatientId", value);
  }, [update]);

  const handleDoctorChange = useCallback((value: string) => {
    setDoctorId(value);
    update("_selectedDoctorId", value);
  }, [update]);

  const cidOptions = (cids as CID10Record[]).map((item) => ({ value: item.codigo, label: `${item.codigo} - ${item.descricao}` }));

  const handleCidSelect = useCallback((code: string) => {
    const cid = (cids as CID10Record[]).find((item) => item.codigo === code);
    if (!cid) return;
    update("f21CidPrincipal", cid.codigo);
    update("f20Diagnostico", cid.descricao);
  }, [update]);

  return (
    <main className="flex-1 min-w-0 relative dark:bg-[#0F172A] overflow-y-auto">
      <div className="absolute inset-0 bg-[url('/bg-fundo.jpeg')] bg-no-repeat bg-cover bg-center opacity-10 z-[-1] dark:bg-none" />
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <Header />
        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">Laudo AIH</h1>
            <p className="text-sm text-[#94A3B8] dark:text-[#64748B] mt-1">Laudo para Solicitação de Autorização de Internação Hospitalar - SUS</p>
          </div>
          <ApacToolbar onPrint={handlePrint} onClear={handleClear} />
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div><p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">Corrija os campos antes de imprimir:</p><ul className="list-disc pl-5">{errors.map((error) => <li key={error} className="text-sm text-red-600 dark:text-red-300">{error}</li>)}</ul></div>
          </div>
        )}

        <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-[#E2E8F0] dark:border-[#334155] p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
          <div className="flex-1"><SearchableSelectGroup label="Paciente" placeholder="Buscar paciente pelo nome..." options={patientOptions} value={patientId} onChange={handlePatientChange} onSearchChange={setPatientQuery} isLoading={patientsLoading} /></div>
          <div className="flex-1"><SearchableSelectGroup label="Médico Solicitante" placeholder="Selecionar médico..." options={doctors.map((item) => ({ value: item.id, label: item.username }))} value={doctorId} onChange={handleDoctorChange} isLoading={doctorsLoading} /></div>
        </div>

        <AihForm data={data} formRef={formRef} update={update} cidOptions={cidOptions} onCidSelect={handleCidSelect} />
      </div>
    </main>
  );
}
