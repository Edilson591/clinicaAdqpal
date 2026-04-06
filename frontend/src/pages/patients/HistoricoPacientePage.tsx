import { useState } from "react";
import { useParams } from "react-router-dom";
import { usePatient } from "../../hooks/usePatients";
import { usePatientHistory } from "../../hooks/usePatientHistory";
import { HistoricoHeader } from "../../components/HistoricoPaciente/HistoricoHeader";
import { PatientInfoCard } from "../../components/HistoricoPaciente/PatientInfoCard";
import { HistoricoList } from "../../components/HistoricoPaciente/HistoricoList";
import { NovoRegistroModal } from "../../components/HistoricoPaciente/NovoRegistroModal";
import type { HistoricoTab } from "../../components/HistoricoPaciente/HistoricoTabBar";
import { Header } from "../../components/Dashboard/Header";
import { FormContent } from "../../components/Form/FormContent";

export default function HistoricoPacientePage() {
  const { id } = useParams<{ id: string }>();
  const patientId = id ?? "";

  const { data: patient } = usePatient(patientId);
  const { data: history = [], isLoading } = usePatientHistory(patientId);

  const [activeTab, setActiveTab] = useState<HistoricoTab>("TODOS");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    // pen: HHGy7 — 1440×900, bg #F5F6FA
    // <div className="flex flex-col h-full bg-[#F5F6FA] overflow-hidden w-full">
    <FormContent>
      {/* pen: obI21 — Header */}
      <Header isSearchAvaliable={false} />
      <HistoricoHeader
        patientName={patient?.name ?? "Paciente"}
        patientId={patientId}
        search={search}
        onSearchChange={setSearch}
      />

      {/* pen: W4ZcF — Content, padding [24,28], gap 20 */}
      <div className="flex flex-col flex-1 gap-5 overflow-hidden">
        {/* pen: HrbEw — Patient Card */}
        {patient && (
          <PatientInfoCard
            patient={patient}
            onNovoRegistro={() => setShowModal(true)}
          />
        )}

        {/* pen: S8FAB — History Card */}
        <HistoricoList
          items={history}
          isLoading={isLoading}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          search={search}
        />
      </div>

      {showModal && (
        <NovoRegistroModal
          patientId={patientId}
          onClose={() => setShowModal(false)}
        />
      )}
    </FormContent>
    // </div>
  );
}
