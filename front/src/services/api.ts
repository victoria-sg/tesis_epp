import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { APP_LOGIN, AUTH_REFRESH } from "../constants/authRoutesConstants";
import {
  API_BASE_URL,
  API_CONTENT_TYPE,
  API_TIMEOUT,
} from "../constants/authServiceConstants";
import {
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
  USER_KEY,
} from "../constants/authStorageConstants";

// ─── Instancia centralizada de Axios ──────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: { "Content-Type": API_CONTENT_TYPE },
});

// ─── Interceptor de request (adjunta token si existe) ──────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const cerrarSesion = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = APP_LOGIN;
};

// El access_token dura poco (30 min por defecto) a propósito; en vez de
// cerrar la sesión en cuanto expira, usamos el refresh_token para pedir uno
// nuevo de forma transparente y reintentar la petición original. Solo se
// cierra la sesión si el refresh también falla (o no hay refresh_token).
//
// `refreshEnCurso` evita que, si varias peticiones expiran al mismo tiempo
// (por ejemplo, al cargar el dashboard), se disparen varios refresh en
// paralelo: todas comparten la misma promesa.
let refreshEnCurso: Promise<string | null> | null = null;

const solicitarNuevoAccessToken = async (): Promise<string | null> => {
  const refreshTokenGuardado = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshTokenGuardado) return null;

  try {
    const { data } = await axios.post<{ access_token: string }>(
      `${API_BASE_URL}${AUTH_REFRESH}`,
      { refresh_token: refreshTokenGuardado },
    );
    localStorage.setItem(TOKEN_KEY, data.access_token);
    return data.access_token;
  } catch {
    return null;
  }
};

// ─── Interceptor de response (maneja errores globales) ────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    const esRutaDeAuth =
      originalRequest?.url?.includes(AUTH_REFRESH) ||
      originalRequest?.url?.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retried &&
      !esRutaDeAuth
    ) {
      originalRequest._retried = true;

      if (!refreshEnCurso) {
        refreshEnCurso = solicitarNuevoAccessToken().finally(() => {
          refreshEnCurso = null;
        });
      }

      const nuevoToken = await refreshEnCurso;
      if (nuevoToken) {
        originalRequest.headers.Authorization = `Bearer ${nuevoToken}`;
        return api(originalRequest);
      }

      cerrarSesion();
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      cerrarSesion();
    }

    return Promise.reject(error);
  },
);

export default api;
