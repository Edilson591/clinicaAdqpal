import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserResponse, LoginResponse } from "../types/api";




// =============================================================================
// COOKIE HELPERS
// =============================================================================

const TOKEN_COOKIE = "adqpal_token";
const USER_COOKIE = "adqpal_user";
const COOKIE_OPTS = "path=/; SameSite=Strict";
const COOKIE_DAYS = 1;

export function setCookie(name: string, value: string): void {
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; ${COOKIE_OPTS}`;
}

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${COOKIE_OPTS}`;
}

// =============================================================================
// STATE
// =============================================================================

interface AuthState {
  user: UserResponse | null;
  token: string | null;
}

function loadInitialState(): AuthState {
  try {
    const token = getCookie(TOKEN_COOKIE);
    const raw = getCookie(USER_COOKIE);
    const user = raw ? (JSON.parse(raw) as UserResponse) : null;
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}

// =============================================================================
// SLICE
// Login/loading/error são responsabilidade do React Query (useMutation).
// O Redux só armazena o estado autenticado persistido em cookie.
// =============================================================================

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    setCredentials(state, action: PayloadAction<LoginResponse>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      setCookie(TOKEN_COOKIE, action.payload.token);
      setCookie(USER_COOKIE, JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      deleteCookie(TOKEN_COOKIE);
      deleteCookie(USER_COOKIE);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
