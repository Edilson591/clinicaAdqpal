import { beforeEach, describe, expect, it } from "vitest";
import { store } from "../../store";
import { logout, setCredentials } from "../../store/authSlice";

const user = {
  id: "user-1",
  username: "Dr. Silva",
  email: "dr@clinic.com",
  roleId: 3,
  cpf: null,
  cnpj: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  store.dispatch(logout());
});

describe("authSlice", () => {
  it("mantém o token fora do Redux e dos armazenamentos JavaScript", () => {
    store.dispatch(setCredentials({ user, token: "jwt-token-abc" }));
    expect(store.getState().auth.token).toBeNull();
    expect(localStorage.getItem("adqpal_token")).toBeNull();
    expect(sessionStorage.getItem("adqpal_temp_token")).toBeNull();
  });

  it("mantém apenas o perfil na sessão da aba", () => {
    store.dispatch(setCredentials({ user, token: "ignored" }));
    expect(store.getState().auth.user?.email).toBe(user.email);
    expect(JSON.parse(sessionStorage.getItem("adqpal_session_user") ?? "null").id).toBe(user.id);
  });

  it("limpa perfil e rascunhos clínicos no logout", () => {
    localStorage.setItem("apac_laudo", "sensitive");
    localStorage.setItem("aih_laudo", "sensitive");
    localStorage.setItem("receituario", "sensitive");
    store.dispatch(setCredentials({ user }));
    store.dispatch(logout());
    expect(store.getState().auth.user).toBeNull();
    expect(sessionStorage.getItem("adqpal_session_user")).toBeNull();
    expect(localStorage.getItem("apac_laudo")).toBeNull();
    expect(localStorage.getItem("aih_laudo")).toBeNull();
    expect(localStorage.getItem("receituario")).toBeNull();
  });
});
