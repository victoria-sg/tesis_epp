export interface Zona {
  id_zona: number;
  nombre_zona: string;
  nivel_riesgo?: string | null;
  capacidad_max?: number | null;
  tiempo_toleracia_segundo?: number | null;
}

export interface ZonaCreate {
  nombre_zona: string;
  nivel_riesgo?: string | null;
  capacidad_max?: number | null;
  tiempo_toleracia_segundo?: number | null;
}

export interface ZonaUpdate {
  nombre_zona?: string;
  nivel_riesgo?: string | null;
  capacidad_max?: number | null;
  tiempo_toleracia_segundo?: number | null;
}

export const ZONA_NIVELES_RIESGO = ["bajo", "medio", "alto"] as const;

// Palabras clave para detectar el nivel automáticamente
const PALABRAS_ALTO = [
  "fundición", "fundicion", "horno", "explosivo", "química", "quimica",
  "peligro", "alto voltaje", "volcado", "caldera", "reactor",
];
const PALABRAS_MEDIO = [
  "trituración", "trituracion", "maquinaria", "prensa", "taller",
  "soldadura", "corte", "producción", "produccion", "ensamble",
];

export const inferirNivelRiesgo = (nombre: string): "bajo" | "medio" | "alto" => {
  const lower = nombre.toLowerCase();
  if (PALABRAS_ALTO.some((p) => lower.includes(p))) return "alto";
  if (PALABRAS_MEDIO.some((p) => lower.includes(p))) return "medio";
  return "bajo";
};

export const NIVEL_RIESGO_CONFIG = {
  alto: {
    label: "Alto",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700 border border-red-200",
  },
  medio: {
    label: "Medio",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    dot: "bg-yellow-500",
    badge: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  },
  bajo: {
    label: "Bajo",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    dot: "bg-green-500",
    badge: "bg-green-100 text-green-700 border border-green-200",
  },
} as const;