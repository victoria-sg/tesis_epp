// ─── Rutas de la API para CRUD ────────────────────────────────────────────────

export const API_ROUTES = {
  // Maestras
  USUARIOS: "/usuarios",
  ROLES: "/roles",
  ZONAS: "/zonas",
  CAMARAS: "/camaras",
  TIPOS_EPP: "/tipos-epp",
  SIRENAS: "/sirenas",

  // Paramétricas
  PERMISOS: "/permisos",

  // Transaccionales
  ALERTAS: "/alertas",
  RESOLUCIONES: "/resoluciones",
  CONTEOS: "/conteos",
} as const;

// ─── Rutas de la aplicación ───────────────────────────────────────────────────

export const APP_ROUTES = {
  DASHBOARD: "/dashboard",
  USUARIOS: "/admin/usuarios",
  ROLES: "/admin/roles",
  ZONAS: "/admin/zonas",
  CAMARAS: "/admin/camaras",
  TIPOS_EPP: "/admin/tipos-epp",
  SIRENAS: "/admin/sirenas",
  REPORTES: "/admin/reportes",
} as const;

// ─── Etiquetas para el sidebar ────────────────────────────────────────────────

export const SIDEBAR_ITEMS = [
  { path: APP_ROUTES.DASHBOARD, label: "Dashboard", icon: "LayoutDashboard" },
  { path: APP_ROUTES.USUARIOS, label: "Usuarios", icon: "Users" },
  { path: APP_ROUTES.ROLES, label: "Roles", icon: "Shield" },
  { path: APP_ROUTES.ZONAS, label: "Zonas", icon: "MapPin" },
  { path: APP_ROUTES.CAMARAS, label: "Cámaras", icon: "Camera" },
  { path: APP_ROUTES.TIPOS_EPP, label: "Tipos de EPP", icon: "Shirt" },
  { path: APP_ROUTES.SIRENAS, label: "Sirenas", icon: "Siren" },
] as const;
