import api from "./api";

export interface DeteccionItem {
  clase: number;
  nombre_clase: string;
  confianza: number;
  bbox: [number, number, number, number];
}

export interface UltimaDeteccion {
  disponible: boolean;
  camara_id?: number;
  timestamp?: string;
  detecciones?: DeteccionItem[];
  total_detecciones?: number;
  clases_detectadas?: string[];
  hay_infraccion?: boolean;
  ancho_frame?: number;
  alto_frame?: number;
}

export const getUltimaDeteccion = async (
  camaraId: number,
): Promise<UltimaDeteccion> => {
  const response = await api.get<UltimaDeteccion>(`/deteccion/ultima/${camaraId}`);
  return response.data;
};