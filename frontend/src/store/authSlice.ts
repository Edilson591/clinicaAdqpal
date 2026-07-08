import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserResponse } from "../types/api";

// =============================================================================
// COOKIE HELPERS
// Apenas para o cookie de dados do usuário (display).
// O token JWT fica em cookie httpOnly gerenciado pelo servidor.
// =============================================================================

const USER_COOKIE = "adqpal_user";
const COOKIE_OPTS = "path=/; SameSite=Strict";
const COOKIE_DAYS = 7;

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setUserCookie(user: UserResponse): void {
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  document.cookie = `${USER_COOKIE}=${encodeURIComponent(JSON.stringify(user))}; expires=${expires}; ${COOKIE_OPTS}`;
}

function deleteUserCookie(): void {
  document.cookie = `${USER_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${COOKIE_OPTS}`;
}

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
    const raw = getCookie(USER_COOKIE);
    const user = raw ? (JSON.parse(raw) as UserResponse) : null;
    const token = localStorage.getItem("adqpal_token");
    const tempToken = sessionStorage.getItem("adqpal_temp_token");
    return { user, token, tempToken };
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
    setCredentials(state, action: PayloadAction<{ user: UserResponse; token: string }>) {
      state.user = action.payload.user ?? null;
      state.token = action.payload.token;
      setUserCookie(action.payload.user);
      localStorage.setItem("adqpal_token", action.payload.token);
    },
    setTempToken(state, action: PayloadAction<string>) {
      state.tempToken = action.payload;
      state.token = null;
      state.user = null;
      sessionStorage.setItem("adqpal_temp_token", action.payload);
      deleteUserCookie();
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
      deleteUserCookie();
      localStorage.removeItem("adqpal_token");
      sessionStorage.removeItem("adqpal_temp_token");
    },
  },
});

export const { setCredentials, setTempToken, clearTempToken, logout } = authSlice.actions;
export default authSlice.reducer;
