import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ui/ProtectedRoute";
import AppLayout from "../layout/AppLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PatientsPage from "../pages/patients/PatientsPage";
import NewPacientPage from "../pages/patients/NewPacientPage";
import EditPacientePage from "../pages/patients/EditPacientePage";
import HistoricoPacientePage from "../pages/patients/HistoricoPacientePage";
import AgendaPage from "../pages/agenda/AgendaPage";
import NovaConsultaPage from "../pages/agenda/NovaConsultaPage";
import ProntuariosPage from "../pages/prontuarios/ProntuariosPage";
import NovoProntuarioPage from "../pages/prontuarios/NovoProntuarioPage";
import EditProntuarioPage from "../pages/prontuarios/EditProntuarioPage";
// import ConfiguracaoPage from "../pages/configuracao/ConfiguracaoPage";
import UsersPage from "../pages/configuracao/UsersPage";
import EditUserPage from "../pages/configuracao/EditUserPage";
import NewUserPage from "../pages/configuracao/NewUserPage";
import PerfilPage from "../pages/perfil/PerfilPage";
import GestaoFinanceiraPage from "../pages/financeiro/GestaoFinanceiraPage";
import NovaTransacaoPage from "../pages/financeiro/NovaTransacaoPage";
import TransacoesPage from "../pages/financeiro/TransacoesPage";
import { UsersGuard } from "../components/ui/UsersGuard";
import RhPage from "../pages/rh/RhPage";
import NewEmployeePage from "../pages/rh/NewEmployeePage";
import EditEmployeePage from "../pages/rh/EditEmployeePage";
// import NotasFiscaisPage from "../pages/notasfiscais/NotasFiscaisPage";
import { NotaFiscalGuard } from "../components/ui/NotaFiscalGuard";
import { RhGuard } from "../components/ui/RhGuard";
import { FinanceiroGuard } from "../components/ui/FinanceiroGuard";

export const privateRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/pacientes" element={<PatientsPage />} />
      <Route path="/pacientes/novo" element={<NewPacientPage />} />
      <Route path="/pacientes/:id/editar" element={<EditPacientePage />} />
      <Route
        path="/pacientes/:id/historico"
        element={<HistoricoPacientePage />}
      />
      <Route path="/agenda" element={<AgendaPage />} />
      <Route path="/agenda/nova" element={<NovaConsultaPage />} />
      <Route path="/prontuarios" element={<ProntuariosPage />} />
      <Route path="/prontuarios/novo" element={<NovoProntuarioPage />} />
      <Route path="/prontuarios/:id/editar" element={<EditProntuarioPage />} />
      <Route element={<NotaFiscalGuard />}>
        {/* <Route path="/notas-fiscais" element={<NotasFiscaisPage />} /> */}
      </Route>
      <Route element={<RhGuard />}>
        <Route path="/rh" element={<RhPage />} />
        <Route path="/rh/novo" element={<NewEmployeePage />} />
        <Route path="/rh/:id/editar" element={<EditEmployeePage />} />
      </Route>

      {/* <Route path="/configuracoes" element={<ConfiguracaoPage />} /> */}

      {/* Gerenciamento de usuários — restrito a Admin e Suporte de TI */}
      <Route element={<UsersGuard />}>
        <Route path="/configuracoes/usuarios" element={<UsersPage />} />
        <Route path="/configuracoes/usuarios/novo" element={<NewUserPage />} />
        <Route
          path="/configuracoes/usuarios/:id/editar"
          element={<EditUserPage />}
        />
      </Route>
      <Route path="/perfil" element={<PerfilPage />} />

      {/* Área Financeira — restrita a Admin, Recepcionista e Suporte de TI */}
      <Route element={<FinanceiroGuard />}>
        <Route path="/financeiro" element={<GestaoFinanceiraPage />} />
        <Route path="/financeiro/nova" element={<NovaTransacaoPage />} />
        <Route path="/financeiro/transacoes" element={<TransacoesPage />} />
      </Route>
    </Route>
  </Route>
);
