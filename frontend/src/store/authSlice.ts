import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserResponse } from "../types/api";

// =============================================================================
// SESSION HELPERS
// Tokens de sessão permanecem exclusivamente em cookies HttpOnly do servidor.
// =============================================================================

const SESSION_USER_KEY = "adqpal_session_user";

// =============================================================================
// STATE
// =============================================================================

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  tempToken: string | null;
}

function loadInitialState(): AuthState {
  try {
    const raw = sessionStorage.getItem(SESSION_USER_KEY);
    const user = raw ? (JSON.parse(raw) as UserResponse) : null;
    const tempToken = sessionStorage.getItem("adqpal_temp_token");
    localStorage.removeItem("adqpal_token");
    return { user, token: null, tempToken };
  } catch {
    return { user: null, token: null, tempToken: null };
  }
}

// =============================================================================
// SLICE
// Token JWT é httpOnly — gerenciado pelo servidor via Set-Cookie.
// O Redux armazena apenas os dados do usuário para exibição na UI.
// =============================================================================

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: UserResponse; token?: string }>) {
      state.user = action.payload.user ?? null;
      state.token = null;
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(action.payload.user));
      localStorage.removeItem("adqpal_token");
    },
    setUser(state, action: PayloadAction<UserResponse>) {
      state.user = action.payload;
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(action.payload));
    },
    setTempToken(state, action: PayloadAction<string>) {
      state.tempToken = action.payload;
      state.token = null;
      state.user = null;
      sessionStorage.setItem("adqpal_temp_token", action.payload);
      sessionStorage.removeItem(SESSION_USER_KEY);
      localStorage.removeItem("adqpal_token");
    },
    clearTempToken(state) {
      state.tempToken = null;
      sessionStorage.removeItem("adqpal_temp_token");
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.tempToken = null;
      sessionStorage.removeItem(SESSION_USER_KEY);
      localStorage.removeItem("adqpal_token");
      sessionStorage.removeItem("adqpal_temp_token");
      localStorage.removeItem("apac_laudo");
      localStorage.removeItem("aih_laudo");
      localStorage.removeItem("receituario");
    },
  },
});

export const { setCredentials, setUser, setTempToken, clearTempToken, logout } = authSlice.actions;
export default authSlice.reducer;
