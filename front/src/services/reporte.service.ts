import { API_ROUTES } from "../constants/apiRoutesConstants";
import type { AlertaReporte } from "../models/reporte.model";
import api from "./api";

export const getReporteAlertas = async (): Promise<AlertaReporte[]> => {
  const response = await api.get<AlertaReporte[]>(
    `${API_ROUTES.ALERTAS}/reporte`,
  );
  return response.data;
};