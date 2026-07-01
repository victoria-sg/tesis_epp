// ─── Interfaces para Tipos de EPP ─────────────────────────────────────────────

export interface TipoEPP {
  id_tipo_epp: number;
  id_rol?: number | null;
  nombre_epp: string;
  descripcion?: string | null;
}

export interface TipoEPPCreate {
  id_rol?: number | null;
  nombre_epp: string;
  descripcion?: string | null;
}

export interface TipoEPPUpdate {
  nombre_epp?: string;
  descripcion?: string | null;
}
