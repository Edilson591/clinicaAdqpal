import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Header } from "../../components/Dashboard/Header";
import { useReceituarioPage } from "../../hooks/useReceituarioPage";
import { usePatientSearch } from "../../hooks/usePatientSearch";
import { usePatient } from "../../hooks/usePatients";
import { SearchableSelectGroup } from "../../components/ui/SearchableSelect";
import { ReceituarioToolbar } from "./ReceituarioToolbar";
import { ReceituarioTabs } from "./ReceituarioTabs";
import { ReceituarioForm } from "./ReceituarioForm";
import { userService } from "../../services/User";
import type { PatientResponse } from "../../types/api";

function fillFromPatient(p: PatientResponse) {
  return {
    examPatient: p.name ?? "",
    recComPatient: p.name ?? "",
    recSemPatient: p.name ?? "",
    cePacNome: p.name ?? "",
    encPatient: p.name ?? "",
    autNome: p.name ?? "",
  };
}

export default function ReceituarioPage() {
  const navigate = useNavigate();

  useEffect(() => {
    userService.checkAdmin().catch(() => {
      navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  const {
    data,
    errors,
    update,
    updateMultiple,
    setTab,
    toggleExam,
    toggleExamCategory,
    selectedCount,
    handlePrint,
    handleClear,
    setSelectedPatientId,
  } = useReceituarioPage();

  const [selectedPatientId, setLocalPatientId] = useState(data._selectedPatientId || "");
  const { options: patientOptions, setQuery: setPatientQuery } = usePatientSearch();
  const { data: patient } = usePatient(selectedPatientId);

  useEffect(() => {
    if (!patient) return;
    const updates = fillFromPatient(patient);
    updateMultiple(updates);
  }, [patient, updateMultiple]);

  const handlePatientChange = useCallback(
    (id: string) => {
      setLocalPatientId(id);
      setSelectedPatientId(id);
    },
    [setSelectedPatientId],
  );

  return (
    <main className="flex-1 relative dark:bg-[#0F172A] overflow-y-auto">
      <div className="absolute inset-0 bg-[url('/bg-fundo.jpeg')] bg-no-repeat bg-cover bg-center opacity-10 z-[-1] dark:bg-none" />
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <Header />

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              Receituário Digital
            </h1>
            <p className="text-sm text-[#94A3B8] dark:text-[#64748B] mt-1">
              Solicitação de exames, receitas, encaminhamentos e autorizações
            </p>
          </div>
          <ReceituarioToolbar onPrint={handlePrint} onClear={handleClear} />
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
                  <li key={i} className="text-sm text-red-600 dark:text-red-300">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Seleção de Paciente */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-[#E2E8F0] dark:border-[#334155] p-4 sm:p-5">
          <SearchableSelectGroup
            label="Paciente"
            placeholder="Buscar paciente pelo nome..."
            options={patientOptions}
            value={selectedPatientId}
            onChange={handlePatientChange}
            onSearchChange={setPatientQuery}
          />
        </div>

        <ReceituarioTabs activeTab={data.tab} onTabChange={setTab} />

        <ReceituarioForm
          data={data}
          update={update}
          toggleExam={toggleExam}
          toggleExamCategory={toggleExamCategory}
          selectedCount={selectedCount}
        />
      </div>
    </main>
  );
}
