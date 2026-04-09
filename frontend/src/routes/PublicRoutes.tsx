import { Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import PoliticaPrivacidadePage from "../pages/lgpd/PoliticaPrivacidadePage";
import TermosDeUsoPage from "../pages/lgpd/TermosDeUsoPage";
import PoliticaCookiesPage from "../pages/lgpd/PoliticaCookiesPage";

export const publicRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/esqueceu-a-senha" element={<ForgotPasswordPage />} />
    <Route path="/politica-de-privacidade" element={<PoliticaPrivacidadePage />} />
    <Route path="/termos-de-uso" element={<TermosDeUsoPage />} />
    <Route path="/politica-de-cookies" element={<PoliticaCookiesPage />} />
  </>
);
