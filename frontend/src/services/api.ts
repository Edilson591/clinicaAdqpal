import axios from "axios";
import { store } from "../store";
// import { logout } from "../store/authSlice";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const state = store.getState().auth;
  const token = state.token ?? state.tempToken ?? localStorage.getItem("adqpal_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
