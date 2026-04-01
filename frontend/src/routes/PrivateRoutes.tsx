import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ui/ProtectedRoute";
import AppLayout from "../layout/AppLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PatientsPage from "../pages/patients/PatientsPage";
import NewPacientPage from "../pages/patients/NewPacientPage";
import EditPacientePage from "../pages/patients/EditPacientePage";
import AgendaPage from "../pages/agenda/AgendaPage";
import NovaConsultaPage from "../pages/agenda/NovaConsultaPage";
import ProntuariosPage from "../pages/prontuarios/ProntuariosPage";
import NovoProntuarioPage from "../pages/prontuarios/NovoProntuarioPage";
import EditProntuarioPage from "../pages/prontuarios/EditProntuarioPage";
import ConfiguracaoPage from "../pages/configuracao/ConfiguracaoPage";
import GestaoFinanceiraPage from "../pages/financeiro/GestaoFinanceiraPage";
import NovaTransacaoPage from "../pages/financeiro/NovaTransacaoPage";

export const privateRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/pacientes" element={<PatientsPage />} />
      <Route path="/pacientes/novo" element={<NewPacientPage />} />
      <Route path="/pacientes/:id/editar" element={<EditPacientePage />} />
      <Route path="/agenda" element={<AgendaPage />} />
      <Route path="/agenda/nova" element={<NovaConsultaPage />} />
      <Route path="/prontuarios" element={<ProntuariosPage />} />
      <Route path="/prontuarios/novo" element={<NovoProntuarioPage />} />
      <Route path="/prontuarios/:id/editar" element={<EditProntuarioPage />} />
      <Route path="/configuracoes" element={<ConfiguracaoPage />} />
      <Route path="/financeiro" element={<GestaoFinanceiraPage />} />
      <Route path="/financeiro/nova" element={<NovaTransacaoPage />} />
    </Route>
  </Route>
);
