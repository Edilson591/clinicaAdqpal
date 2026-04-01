import { Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

export const publicRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/esqueceu-a-senha" element={<ForgotPasswordPage />} />
  </>
);
