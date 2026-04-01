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
  const { user, token } = useSelector((state: RootState) => state.auth);

  const logout = () => dispatch(logoutAction());

  return {
    user,
    token,
    isAuthenticated: !!token,
    logout,
  };
}
