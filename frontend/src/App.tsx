import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { publicRoutes } from "./routes/PublicRoutes";
import { privateRoutes } from "./routes/PrivateRoutes";
import { ConsentProvider } from "./context/ConsentProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConsentProvider>
          <ThemeProvider>
            <a href="#main-content" className="skip-link">Ir para o conteúdo principal</a>
            <Routes>
              {publicRoutes}
              {privateRoutes}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ThemeProvider>
        </ConsentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
