// ─── Configuración del servicio de API ────────────────────────────────────────

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const API_TIMEOUT: number = 10_000;

export const API_CONTENT_TYPE: string = "application/json";
