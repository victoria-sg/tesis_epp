// ─── Tipo de rol interno (para UI) ────────────────────────────────────────────
export type Rol = "supervisor" | "sso" | "admin";

// ─── Etiquetas de rol ─────────────────────────────────────────────────────────
export const ROL_LABELS: Record<Rol, string> = {
  supervisor: "SUPERVISOR DE TURNO",
  sso: "JEFE DE PLANTA",
  admin: "ADMINISTRADOR TI",
};

// ─── Mapeo del nombre de rol del backend → Rol interno ───────────────────────
export const ROL_MAP: Record<string, Rol> = {
  Administrador: "admin",
  "Supervisor de Turno": "supervisor",
  "Encargado SSO": "sso",
  "Encargado de Planta": "sso",
  "Jefe de Planta": "sso",
};

// ─── Request / Response del backend ───────────────────────────────────────────
export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface UsuarioFromBackend {
  id_usuario: number;
  nombre: string;
  apelido: string;
  correo: string;
  rol: string;
  permisos: string[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  usuario: UsuarioFromBackend;
}

// ─── Recuperación de contraseña ────────────────────────────────────────────
export interface SolicitarRecuperacionRequest {
  correo: string;
}

export interface RestablecerPasswordRequest {
  token: string;
  nueva_contrasena: string;
}

export interface MensajeResponse {
  mensaje: string;
}

// ─── Usuario de sesión (transformado del backend) ─────────────────────────────
export interface LoggedUser {
  id_usuario: number;
  nombre: string;
  apelido: string;
  correo: string;
  rol: Rol;
  rolLabel: string;
  permisos: string[];
}

// ─── Roles disponibles para el selector ────────────────────────────────────────
export const AVAILABLE_ROLES: { rol: Rol; rolLabel: string }[] = [
  { rol: "supervisor", rolLabel: ROL_LABELS.supervisor },
  { rol: "sso", rolLabel: ROL_LABELS.sso },
  { rol: "admin", rolLabel: ROL_LABELS.admin },
];

// ─── Info visual por rol ──────────────────────────────────────────────────────
export interface RoleStyle {
  gradient: string;
  ring: string;
  badgeBg: string;
  badgeText: string;
  iconName: "HardHat" | "ShieldCheck" | "Cog";
  hex: string;
}

export const ROLE_STYLES: Record<Rol, RoleStyle> = {
  supervisor: {
    gradient: "from-[#2563eb] to-[#1d4ed8]",
    ring: "hover:ring-[#2563eb]/30 hover:border-[#2563eb]",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    iconName: "HardHat",
    hex: "#2563eb",
  },
  sso: {
    gradient: "from-[#f97316] to-[#ea580c]",
    ring: "hover:ring-[#f97316]/30 hover:border-[#f97316]",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-700",
    iconName: "ShieldCheck",
    hex: "#f97316",
  },
  admin: {
    gradient: "from-[#7c3aed] to-[#6d28d9]",
    ring: "hover:ring-[#7c3aed]/30 hover:border-[#7c3aed]",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    iconName: "Cog",
    hex: "#7c3aed",
  },
};

export interface RoleInfo {
  title: string;
  subtitle: string;
  desc: string;
  perks: string[];
}

export const ROLE_INFO: Record<Rol, RoleInfo> = {
  supervisor: {
    title: "Supervisor de Turno",
    subtitle: "Operación en tiempo real",
    desc: "Monitorea alertas activas, mapa de calor y respuesta de sirena en planta.",
    perks: ["Alertas en vivo", "Mapa de zonas", "Justificación"],
  },
  sso: {
    title: "Jefe de Planta",
    subtitle: "Cumplimiento y reportes",
    desc: "Analiza KPIs de cumplimiento, tendencias históricas y auditoría exportable.",
    perks: ["KPIs globales", "Tendencias", "Exportar auditoría"],
  },
  admin: {
    title: "Administrador de TI",
    subtitle: "Configuración del sistema",
    desc: "Gestiona matriz EPP × Zona, hardware IP, calibración de IA y usuarios.",
    perks: ["Matriz EPP", "Hardware", "Usuarios"],
  },
};