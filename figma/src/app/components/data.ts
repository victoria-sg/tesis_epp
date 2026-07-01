export type EstadoZona = "activo" | "inactivo";
export type EstadoCamara = "activo" | "inactivo" | "mantenimiento";
export type EstadoAlerta = "pendiente" | "reproducida" | "silenciada" | "expirada";
export type UserRole = "supervisor" | "sso" | "admin";
export type NivelEPP = "Obligatorio" | "Opcional" | "Desactivado";
export type NivelCritico = "alto" | "medio" | "bajo";
export type MetodoCierre = "Automático" | "Manual — Falso Positivo" | "Manual — Justificado" | "Expirado";
export type EstadoDispositivo = "online" | "offline";

export interface Incumplimiento {
  id: number;
  fecha: string;
  zona: string;
  camara: string;
  epp: string;
  confianza: number;
  estado: EstadoAlerta;
  evidencia: string;
}

export interface LoggedUser {
  nombre: string;
  apellido: string;
  initials: string;
  correo: string;
  rol: UserRole;
  rolLabel: string;
  empresa: string;
}

export interface AuditoriaEntry {
  id: number;
  fecha: string;
  hora: string;
  zona: string;
  epp: string;
  camara: string;
  confianza: number;
  metodoCierre: MetodoCierre;
}

export interface ZonaEPPConfig {
  [epp: string]: NivelEPP;
}

export interface MatrizEPP {
  [zonaId: number]: ZonaEPPConfig;
}

// ── Demo users (one per role) ──────────────────────────────────────────────
export const DEMO_USERS: LoggedUser[] = [
  {
    nombre: "Carlos", apellido: "Mendoza", initials: "CM",
    correo: "c.mendoza@empresa.com",
    rol: "supervisor", rolLabel: "Supervisor de Turno", empresa: "Planta Norte",
  },
  {
    nombre: "Lucía", apellido: "Rojas", initials: "LR",
    correo: "l.rojas@empresa.com",
    rol: "sso", rolLabel: "Jefe de Seguridad", empresa: "Planta Norte",
  },
  {
    nombre: "Pedro", apellido: "Ramírez", initials: "PR",
    correo: "p.ramirez@empresa.com",
    rol: "admin", rolLabel: "Administrador TI", empresa: "Planta Norte",
  },
];

// ── General KPIs ─────────────────────────────────────────────────────────
export const KPIS = {
  zonasActivas: 12,
  zonasTotal: 14,
  camarasOnline: 38,
  camarasTotal: 42,
  incumplimientosHoy: 27,
  alertasPendientes: 6,
};

// ── KPIs para Dashboard Analítico ─────────────────────────────────────────
export const KPI_ANALITICO = {
  cumplimientoGlobal: 93,
  efectividadSirena: 78,
  tiempoPromedioExposicion: 42,
};

// ── Incumplimientos feed ──────────────────────────────────────────────────
export const FEED: Incumplimiento[] = [
  { id: 1024, fecha: "2026-06-01 14:32:11", zona: "Planta — Zona A", camara: "CAM-A1", epp: "Casco", confianza: 0.94, estado: "pendiente", evidencia: "" },
  { id: 1023, fecha: "2026-06-01 14:28:02", zona: "Almacén — Carga", camara: "CAM-B3", epp: "Chaleco", confianza: 0.88, estado: "pendiente", evidencia: "" },
  { id: 1022, fecha: "2026-06-01 14:21:50", zona: "Planta — Zona B", camara: "CAM-A4", epp: "Guantes", confianza: 0.72, estado: "reproducida", evidencia: "" },
  { id: 1021, fecha: "2026-06-01 14:17:33", zona: "Soldadura", camara: "CAM-S1", epp: "Máscaras de soldar", confianza: 0.96, estado: "pendiente", evidencia: "" },
  { id: 1020, fecha: "2026-06-01 14:09:14", zona: "Planta — Zona A", camara: "CAM-A2", epp: "Casco", confianza: 0.58, estado: "silenciada", evidencia: "" },
  { id: 1019, fecha: "2026-06-01 14:02:01", zona: "Patio Logístico", camara: "CAM-P1", epp: "Chaleco", confianza: 0.91, estado: "reproducida", evidencia: "" },
  { id: 1018, fecha: "2026-06-01 13:55:22", zona: "Soldadura", camara: "CAM-S2", epp: "Guantes", confianza: 0.83, estado: "expirada", evidencia: "" },
  { id: 1017, fecha: "2026-06-01 13:48:09", zona: "Almacén — Carga", camara: "CAM-B1", epp: "Botas", confianza: 0.77, estado: "pendiente", evidencia: "" },
];

// ── Zonas ────────────────────────────────────────────────────────────────
export const ZONAS = [
  { id: 1, sede: "Lima Norte", nombre: "Planta — Zona A", descripcion: "Línea de ensamblaje principal", estado: "activo" as EstadoZona, eppsCount: 4 },
  { id: 2, sede: "Lima Norte", nombre: "Planta — Zona B", descripcion: "Ensamblaje secundario", estado: "activo" as EstadoZona, eppsCount: 3 },
  { id: 3, sede: "Lima Norte", nombre: "Almacén — Carga", descripcion: "Andén de carga y descarga", estado: "activo" as EstadoZona, eppsCount: 3 },
  { id: 4, sede: "Lima Norte", nombre: "Soldadura", descripcion: "Estaciones de soldadura", estado: "activo" as EstadoZona, eppsCount: 5 },
  { id: 5, sede: "Callao", nombre: "Patio Logístico", descripcion: "Operación de montacargas", estado: "activo" as EstadoZona, eppsCount: 3 },
  { id: 6, sede: "Callao", nombre: "Oficina Técnica", descripcion: "Acceso restringido", estado: "inactivo" as EstadoZona, eppsCount: 1 },
];

// ── Tipos de EPP ─────────────────────────────────────────────────────────
export const TIPOS_EPP = [
  "Casco",
  "Chaleco",
  "Guantes",
  "Botas",
  "Orejeras",
  "Máscaras de soldar",
];

// ── Cámaras (básico, para visualización) ────────────────────────────────
export const CAMARAS = [
  { id: 1, nombre: "CAM-A1", zona: "Planta — Zona A", ubicacion: "Ingreso norte", ip: "rtsp://10.0.1.21:554/stream1", estado: "activo" as EstadoCamara },
  { id: 2, nombre: "CAM-A2", zona: "Planta — Zona A", ubicacion: "Centro línea", ip: "rtsp://10.0.1.22:554/stream1", estado: "activo" as EstadoCamara },
  { id: 3, nombre: "CAM-A4", zona: "Planta — Zona B", ubicacion: "Salida sur", ip: "rtsp://10.0.1.24:554/stream1", estado: "mantenimiento" as EstadoCamara },
  { id: 4, nombre: "CAM-B1", zona: "Almacén — Carga", ubicacion: "Andén 1", ip: "rtsp://10.0.2.11:554/stream1", estado: "activo" as EstadoCamara },
  { id: 5, nombre: "CAM-B3", zona: "Almacén — Carga", ubicacion: "Andén 3", ip: "rtsp://10.0.2.13:554/stream1", estado: "activo" as EstadoCamara },
  { id: 6, nombre: "CAM-S1", zona: "Soldadura", ubicacion: "Estación 1", ip: "rtsp://10.0.3.11:554/stream1", estado: "activo" as EstadoCamara },
  { id: 7, nombre: "CAM-S2", zona: "Soldadura", ubicacion: "Estación 2", ip: "rtsp://10.0.3.12:554/stream1", estado: "inactivo" as EstadoCamara },
  { id: 8, nombre: "CAM-P1", zona: "Patio Logístico", ubicacion: "Acceso vehicular", ip: "rtsp://10.0.4.11:554/stream1", estado: "activo" as EstadoCamara },
];

// ── Cámaras técnico (con FPS y latencia para panel TI) ────────────────
export const CAMARAS_TECH = [
  { id: 1, codigo: "CAM-TRI-01", zona: "Planta — Zona A", ip: "10.0.1.21", estado: "online" as EstadoDispositivo, fps: 30, latencia: 12 },
  { id: 2, codigo: "CAM-TRI-02", zona: "Planta — Zona A", ip: "10.0.1.22", estado: "online" as EstadoDispositivo, fps: 25, latencia: 18 },
  { id: 3, codigo: "CAM-ZB-01", zona: "Planta — Zona B", ip: "10.0.1.24", estado: "offline" as EstadoDispositivo, fps: 0, latencia: 0 },
  { id: 4, codigo: "CAM-ALM-01", zona: "Almacén — Carga", ip: "10.0.2.11", estado: "online" as EstadoDispositivo, fps: 30, latencia: 8 },
  { id: 5, codigo: "CAM-ALM-03", zona: "Almacén — Carga", ip: "10.0.2.13", estado: "online" as EstadoDispositivo, fps: 30, latencia: 15 },
  { id: 6, codigo: "CAM-SOL-01", zona: "Soldadura", ip: "10.0.3.11", estado: "online" as EstadoDispositivo, fps: 30, latencia: 11 },
  { id: 7, codigo: "CAM-SOL-02", zona: "Soldadura", ip: "10.0.3.12", estado: "offline" as EstadoDispositivo, fps: 0, latencia: 0 },
  { id: 8, codigo: "CAM-PAT-01", zona: "Patio Logístico", ip: "10.0.4.11", estado: "online" as EstadoDispositivo, fps: 25, latencia: 22 },
];

// ── Sirenas por zona (para panel TI) ─────────────────────────────────────
export const SIRENAS = [
  { id: 1, codigoSirena: "SIR-ZA-01", zona: "Planta — Zona A", ip: "192.168.1.100", estado: "online" as EstadoDispositivo },
  { id: 2, codigoSirena: "SIR-ZB-01", zona: "Planta — Zona B", ip: "192.168.1.101", estado: "online" as EstadoDispositivo },
  { id: 3, codigoSirena: "SIR-AL-01", zona: "Almacén — Carga", ip: "192.168.1.102", estado: "offline" as EstadoDispositivo },
  { id: 4, codigoSirena: "SIR-SO-01", zona: "Soldadura", ip: "192.168.1.103", estado: "online" as EstadoDispositivo },
  { id: 5, codigoSirena: "SIR-PL-01", zona: "Patio Logístico", ip: "192.168.1.104", estado: "online" as EstadoDispositivo },
];

// ── Usuarios ─────────────────────────────────────────────────────────────
export const USUARIOS = [
  { id: 1, nombre: "Pedro", apellido: "Ramírez", correo: "p.ramirez@empresa.com", rol: "Administrador TI", telefono: "+51 987 123 456", empresa: "Planta Norte", estado: "Activo" },
  { id: 2, nombre: "Juan", apellido: "Pérez", correo: "juan.perez@empresa.com", rol: "Encargado", telefono: "+51 987 111 222", empresa: "Planta Norte", estado: "Activo" },
  { id: 3, nombre: "María", apellido: "Gómez", correo: "maria.gomez@empresa.com", rol: "Operario", telefono: "+51 987 333 444", empresa: "Planta Norte", estado: "Activo" },
  { id: 4, nombre: "Carlos", apellido: "Mendoza", correo: "c.mendoza@empresa.com", rol: "Supervisor de Turno", telefono: "+51 987 234 567", empresa: "Planta Norte", estado: "Activo" },
  { id: 5, nombre: "Lucía", apellido: "Rojas", correo: "l.rojas@empresa.com", rol: "Jefe de Seguridad", telefono: "+51 987 345 678", empresa: "Planta Norte", estado: "Activo" },
  { id: 6, nombre: "Diego", apellido: "Salazar", correo: "d.salazar@empresa.com", rol: "Supervisor de Turno", telefono: "+51 987 456 789", empresa: "Planta Sur", estado: "Inactivo" },
  { id: 7, nombre: "María", apellido: "Vega", correo: "m.vega@empresa.com", rol: "Operario", telefono: "+51 987 567 890", empresa: "Planta Sur", estado: "Activo" },
];

// ── Tendencia 7 días ──────────────────────────────────────────────────────
export const TENDENCIA_7D = [
  { dia: "Mié", incumplimientos: 18, alertas: 12 },
  { dia: "Jue", incumplimientos: 24, alertas: 19 },
  { dia: "Vie", incumplimientos: 31, alertas: 28 },
  { dia: "Sáb", incumplimientos: 9, alertas: 6 },
  { dia: "Dom", incumplimientos: 4, alertas: 3 },
  { dia: "Lun", incumplimientos: 27, alertas: 22 },
  { dia: "Hoy", incumplimientos: 27, alertas: 6 },
];

// ── Heatmap (nivel de incumplimiento por zona) ────────────────────────────
export const HEATMAP_ZONAS = [
  { zona: "Planta A", nivel: 0.85 },
  { zona: "Planta B", nivel: 0.42 },
  { zona: "Almacén", nivel: 0.61 },
  { zona: "Soldadura", nivel: 0.91 },
  { zona: "Patio", nivel: 0.28 },
  { zona: "Oficinas", nivel: 0.05 },
];

// ── Top EPP olvidado (para Dashboard Analítico) ───────────────────────────
export const TOP_EPP_OLVIDADO = [
  { epp: "Casco", total: 89 },
  { epp: "Orejeras", total: 64 },
  { epp: "Máscaras de soldar", total: 51 },
  { epp: "Guantes", total: 38 },
  { epp: "Chaleco", total: 22 },
  { epp: "Botas", total: 15 },
];

// ── Zonas críticas ranking ────────────────────────────────────────────────
export const ZONAS_CRITICAS: { zona: string; incidencias: number; nivel: NivelCritico }[] = [
  { zona: "Soldadura", incidencias: 41, nivel: "alto" },
  { zona: "Planta — Zona A", incidencias: 35, nivel: "alto" },
  { zona: "Almacén — Carga", incidencias: 22, nivel: "medio" },
  { zona: "Patio Logístico", incidencias: 18, nivel: "medio" },
  { zona: "Planta — Zona B", incidencias: 12, nivel: "bajo" },
];

// ── Auditoría histórica ────────────────────────────────────────────────────
export const AUDITORIA: AuditoriaEntry[] = [
  { id: 1024, fecha: "2026-06-01", hora: "14:32:11", zona: "Planta — Zona A", epp: "Casco", camara: "CAM-A1", confianza: 0.94, metodoCierre: "Automático" },
  { id: 1023, fecha: "2026-06-01", hora: "14:28:02", zona: "Almacén — Carga", epp: "Chaleco", camara: "CAM-B3", confianza: 0.88, metodoCierre: "Automático" },
  { id: 1022, fecha: "2026-06-01", hora: "14:21:50", zona: "Planta — Zona B", epp: "Guantes", camara: "CAM-A4", confianza: 0.72, metodoCierre: "Manual — Justificado" },
  { id: 1021, fecha: "2026-06-01", hora: "14:17:33", zona: "Soldadura", epp: "Máscaras de soldar", camara: "CAM-S1", confianza: 0.96, metodoCierre: "Automático" },
  { id: 1020, fecha: "2026-06-01", hora: "14:09:14", zona: "Planta — Zona A", epp: "Casco", camara: "CAM-A2", confianza: 0.58, metodoCierre: "Manual — Falso Positivo" },
  { id: 1019, fecha: "2026-06-01", hora: "14:02:01", zona: "Patio Logístico", epp: "Chaleco", camara: "CAM-P1", confianza: 0.91, metodoCierre: "Automático" },
  { id: 1018, fecha: "2026-06-01", hora: "13:55:22", zona: "Soldadura", epp: "Guantes", camara: "CAM-S2", confianza: 0.83, metodoCierre: "Expirado" },
  { id: 1017, fecha: "2026-06-01", hora: "13:48:09", zona: "Almacén — Carga", epp: "Botas", camara: "CAM-B1", confianza: 0.77, metodoCierre: "Automático" },
  { id: 1016, fecha: "2026-05-31", hora: "16:22:44", zona: "Planta — Zona A", epp: "Orejeras", camara: "CAM-A1", confianza: 0.89, metodoCierre: "Automático" },
  { id: 1015, fecha: "2026-05-31", hora: "15:11:30", zona: "Soldadura", epp: "Máscaras de soldar", camara: "CAM-S1", confianza: 0.95, metodoCierre: "Automático" },
  { id: 1014, fecha: "2026-05-31", hora: "14:05:18", zona: "Patio Logístico", epp: "Chaleco", camara: "CAM-P1", confianza: 0.68, metodoCierre: "Manual — Falso Positivo" },
  { id: 1013, fecha: "2026-05-31", hora: "13:38:52", zona: "Almacén — Carga", epp: "Casco", camara: "CAM-B3", confianza: 0.82, metodoCierre: "Automático" },
];

// ── Calibración de la IA ──────────────────────────────────────────────────
export const IA_CALIBRACION = {
  totalAlertas: 279,
  falsosPositivos: 11,
  porcentajeError: 3.9,
  umbralRiesgo: 5,
};

// ── Matriz EPP por zona (configuración inicial) ──────────────────────────
export const MATRIZ_EPP_INICIAL: MatrizEPP = {
  1: { "Casco": "Obligatorio", "Chaleco": "Obligatorio", "Guantes": "Opcional", "Botas": "Obligatorio", "Orejeras": "Desactivado", "Máscaras de soldar": "Desactivado" },
  2: { "Casco": "Obligatorio", "Chaleco": "Obligatorio", "Guantes": "Opcional", "Botas": "Obligatorio", "Orejeras": "Desactivado", "Máscaras de soldar": "Desactivado" },
  3: { "Casco": "Obligatorio", "Chaleco": "Obligatorio", "Guantes": "Opcional", "Botas": "Obligatorio", "Orejeras": "Desactivado", "Máscaras de soldar": "Desactivado" },
  4: { "Casco": "Obligatorio", "Chaleco": "Obligatorio", "Guantes": "Obligatorio", "Botas": "Obligatorio", "Orejeras": "Obligatorio", "Máscaras de soldar": "Obligatorio" },
  5: { "Casco": "Opcional", "Chaleco": "Obligatorio", "Guantes": "Desactivado", "Botas": "Obligatorio", "Orejeras": "Desactivado", "Máscaras de soldar": "Desactivado" },
  6: { "Casco": "Desactivado", "Chaleco": "Opcional", "Guantes": "Desactivado", "Botas": "Desactivado", "Orejeras": "Desactivado", "Máscaras de soldar": "Desactivado" },
};
