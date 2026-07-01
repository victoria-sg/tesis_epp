export interface AlertaReporte {
  id_alerta: number;
  fecha_hora_deteccion: string | null;
  segundos_transcurridos: number | null;
  estado_alerta: string | null;
  codigo_camara: string;
  nombre_zona: string;
  captura_frame: string | null;
  comentario_resolucion: string | null;
  fecha_hora_resolucion: string | null;
  resuelto_por: string | null;
}