import axios from "axios";
import { store } from "../store";
// import { logout } from "../store/authSlice";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  if (!csrfPromise) {
    csrfPromise = axios
      .get<{ csrfToken: string }>(`${apiUrl}/users/csrf`, { withCredentials: true })
      .then((response) => {
        csrfToken = response.data.csrfToken;
        return csrfToken;
      })
      .finally(() => {
        csrfPromise = null;
      });
  }
  return csrfPromise;
}

function needsCsrf(method?: string, url?: string): boolean {
  if (!method || !["post", "put", "patch", "delete"].includes(method.toLowerCase())) return false;
  return ![
    "/users/login",
    "/users/verify-2fa",
    "/users/verify-2fa/resend",
    "/users/refresh",
    "/password/forgot",
    "/password/reset",
    "/privacy/requests",
  ].some((path) => url === path || url?.startsWith(`${path}/`));
}

api.interceptors.request.use((config) => {
  const state = store.getState().auth;
  const token = state.tempToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!token && needsCsrf(config.method, config.url)) {
    return getCsrfToken().then((value) => {
      config.headers["X-CSRF-Token"] = value;
      return config;
    });
  }
  return config;
});

// Limpa estado Redux e redireciona ao receber 401
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       store.dispatch(logout());
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   },
// );

export default api;
