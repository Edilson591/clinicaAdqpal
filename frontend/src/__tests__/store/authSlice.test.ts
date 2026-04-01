import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../../store';
import { setCredentials, logout, getCookie, setCookie, deleteCookie } from '../../store/authSlice';

// jsdom suporta document.cookie
beforeEach(() => {
  // limpa cookies entre testes
  document.cookie = 'adqpal_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  document.cookie = 'adqpal_user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  store.dispatch(logout());
});

const mockLoginResponse = {
  token: 'jwt-token-abc',
  user: { id: 'user-1', name: 'Dr. Silva', email: 'dr@clinic.com', username: 'drsilva', role: 'ADMIN' as const },
};

// ── Cookie helpers ────────────────────────────────────────────────────────────

describe('cookie helpers', () => {
  it('setCookie / getCookie round-trip', () => {
    setCookie('test_key', 'hello world');
    expect(getCookie('test_key')).toBe('hello world');
  });

  it('getCookie returns null for missing cookie', () => {
    expect(getCookie('non_existent')).toBeNull();
  });

  it('deleteCookie removes the cookie', () => {
    setCookie('del_key', 'value');
    deleteCookie('del_key');
    expect(getCookie('del_key')).toBeNull();
  });
});

// ── Redux slice ───────────────────────────────────────────────────────────────

describe('authSlice', () => {
  it('initial state has no token or user', () => {
    const state = store.getState().auth;
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('setCredentials stores token and user in Redux', () => {
    store.dispatch(setCredentials(mockLoginResponse));
    const state = store.getState().auth;
    expect(state.token).toBe('jwt-token-abc');
    expect(state.user?.email).toBe('dr@clinic.com');
  });

  it('setCredentials persists token in cookie', () => {
    store.dispatch(setCredentials(mockLoginResponse));
    expect(getCookie('adqpal_token')).toBe('jwt-token-abc');
  });

  it('logout clears Redux state', () => {
    store.dispatch(setCredentials(mockLoginResponse));
    store.dispatch(logout());
    const state = store.getState().auth;
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('logout removes cookies', () => {
    store.dispatch(setCredentials(mockLoginResponse));
    store.dispatch(logout());
    expect(getCookie('adqpal_token')).toBeNull();
    expect(getCookie('adqpal_user')).toBeNull();
  });
});
