// ─── Interfaces para Sirenas ──────────────────────────────────────────────────

export interface Sirena {
  id_sirena: number;
  id_zona: number;
  codigo_sirena: string;
  ip_direccion?: string | null;
  estado_dispositivo?: string | null;
  // Propiedades adicionales de respuesta
  zona_nombre?: string;
}

export interface SirenaCreate {
  id_zona: number;
  codigo_sirena: string;
  ip_direccion?: string | null;
  estado_dispositivo?: string | null;
}

export interface SirenaUpdate {
  codigo_sirena?: string;
  ip_direccion?: string | null;
  estado_dispositivo?: string | null;
}

export const SIRENA_ESTADOS = ["online", "offline"] as const;
