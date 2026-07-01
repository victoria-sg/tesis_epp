// ─── Interfaces para Cámaras ──────────────────────────────────────────────────

export interface Camara {
  id_camara: number;
  id_zona: number;
  codigo_camara: string;
  tipo_fuente: string;
  ip_direccion?: string | null;
  estado_conexion?: string | null;
  ultima_conexion?: string | null;
  zona_nombre?: string;
}

export interface CamaraCreate {
  id_zona: number;
  codigo_camara: string;
  tipo_fuente: string;
  ip_direccion?: string | null;
  estado_conexion?: string | null;
}

export interface CamaraUpdate {
  id_zona?: number;
  codigo_camara?: string;
  tipo_fuente?: string;
  ip_direccion?: string | null;
  estado_conexion?: string | null;
}

export const CAMARA_ESTADOS = ["activo", "inactivo", "mantenimiento"] as const;

export const TIPOS_FUENTE = [
  { value: "hikvision", label: "Hikvision RTSP" },
  { value: "rtsp_generic", label: "Cámara RTSP Genérica" },
  { value: "fallback_phone", label: "Teléfono (Fallback)" },
] as const;