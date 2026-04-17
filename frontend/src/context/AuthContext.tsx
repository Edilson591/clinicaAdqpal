import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store";

// =============================================================================
// useAuth
//
// Hook que expõe o estado de autenticação do Redux store.
// Loading e error do login ficam no useMutation (useLoginForm).
// =============================================================================

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const logout = () => {
    // Limpa o cookie httpOnly no servidor, depois limpa Redux
    fetch(`${import.meta.env.VITE_API_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => dispatch(logoutAction()));
  };

  return {
    user,
    token: null, // token é httpOnly — não acessível via JS
    isAuthenticated: !!user,
    logout,
  };
}
