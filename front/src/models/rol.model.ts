// ─── Interfaces para Roles ────────────────────────────────────────────────────

export interface Rol {
  id_rol: number;
  nombre_rol: string;
  descripcion?: string | null;
}

export interface RolCreate {
  nombre_rol: string;
  descripcion?: string | null;
}

export interface RolUpdate {
  nombre_rol?: string;
  descripcion?: string | null;
}

export interface RolConPermisos extends Rol {
  permisos: number[];
}

// ─── Permisos disponibles en el sistema ──────────────────────────────────────
// Deben coincidir con EPP_P_PERMISO en la base de datos.
export const PERMISOS_DISPONIBLES: { id: number; descripcion: string; etiqueta: string }[] = [
  { id: 1, descripcion: "GESTIONAR_USUARIOS",  etiqueta: "Gestionar usuarios" },
  { id: 2, descripcion: "GESTIONAR_ZONAS",     etiqueta: "Gestionar zonas" },
  { id: 3, descripcion: "GESTIONAR_CAMARAS",   etiqueta: "Gestionar cámaras" },
  { id: 4, descripcion: "GESTIONAR_ALERTAS",   etiqueta: "Gestionar alertas" },
  { id: 5, descripcion: "VER_DASHBOARD",        etiqueta: "Ver dashboard" },
  { id: 6, descripcion: "EXPORTAR_REPORTES",   etiqueta: "Exportar reportes" },
  { id: 7, descripcion: "JUSTIFICAR_ALERTA",   etiqueta: "Justificar alerta" },
  { id: 8, descripcion: "VER_ZONAS",           etiqueta: "Ver zonas" },
];