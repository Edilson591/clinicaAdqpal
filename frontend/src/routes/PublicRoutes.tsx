import { Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import Auth2faPage from "../pages/auth/Auth2faPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ForgotPasswordSuccessPage from "../pages/auth/ForgotPasswordSuccessPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ResetPasswordSuccessPage from "../pages/auth/ResetPasswordSuccessPage";
import TokenExpiredPage from "../pages/auth/TokenExpiredPage";
import PoliticaPrivacidadePage from "../pages/lgpd/PoliticaPrivacidadePage";
import TermosDeUsoPage from "../pages/lgpd/TermosDeUsoPage";
import PoliticaCookiesPage from "../pages/lgpd/PoliticaCookiesPage";

export const publicRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/auth2fa" element={<Auth2faPage />} />
    <Route path="/esqueceu-a-senha" element={<ForgotPasswordPage />} />
    <Route path="/esqueceu-a-senha/sucesso" element={<ForgotPasswordSuccessPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/reset-password/sucesso" element={<ResetPasswordSuccessPage />} />
    <Route path="/reset-password/expirado" element={<TokenExpiredPage />} />
    <Route path="/politica-de-privacidade" element={<PoliticaPrivacidadePage />} />
    <Route path="/termos-de-uso" element={<TermosDeUsoPage />} />
    <Route path="/politica-de-cookies" element={<PoliticaCookiesPage />} />
  </>
);
