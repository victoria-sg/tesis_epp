import {
  Activity,
  Bell,
  Camera,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  Search,
  Shield,
  ShieldCheck,
  Shirt,
  Siren,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { APP_LOGIN } from "../../constants/authRoutesConstants";
import type { RootState } from "../../store";
import { logout } from "../../store/authSlice";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const ROLE_NAV_ITEMS: Record<string, NavItem[]> = {
  admin: [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { path: "/admin/usuarios", label: "Gestión de Usuarios", icon: <Users size={16} /> },
    { path: "/admin/roles", label: "Roles", icon: <Shield size={16} /> },
    { path: "/admin/zonas", label: "Zonas", icon: <MapPin size={16} /> },
    { path: "/admin/camaras", label: "Cámaras", icon: <Camera size={16} /> },
    { path: "/admin/tipos-epp", label: "Tipos de EPP", icon: <Shirt size={16} /> },
    { path: "/admin/sirenas", label: "Sirenas", icon: <Siren size={16} /> },
    { path: "/admin/reportes", label: "Reportes", icon: <FileText size={16} /> },
  ],
  supervisor: [
    { path: "/dashboard", label: "Dashboard Operativo", icon: <Activity size={16} /> },
    { path: "/admin/camaras", label: "Cámaras en vivo", icon: <Camera size={16} /> },
  ],
  sso: [
    { path: "/dashboard", label: "Dashboard Analítico", icon: <Activity size={16} /> },
    { path: "/admin/camaras", label: "Cámaras", icon: <Camera size={16} /> },
    { path: "/admin/reportes", label: "Reportes", icon: <FileText size={16} /> },
  ],
};

const ROLE_GRADIENT: Record<string, string> = {
  supervisor: "from-[#3b82f6] to-[#2563eb]",
  sso: "from-[#10b981] to-[#059669]",
  admin: "from-[#8b5cf6] to-[#7c3aed]",
};

const ROLE_COLOR: Record<string, string> = {
  supervisor: "#3b82f6",
  sso: "#10b981",
  admin: "#8b5cf6",
};

export const AppLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) navigate(APP_LOGIN, { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const navItems = ROLE_NAV_ITEMS[user.rol] ?? ROLE_NAV_ITEMS.admin;
  const gradient = ROLE_GRADIENT[user.rol] ?? ROLE_GRADIENT.admin;
  const color = ROLE_COLOR[user.rol] ?? ROLE_COLOR.admin;

  const handleLogout = () => {
    dispatch(logout());
    navigate(APP_LOGIN, { replace: true });
  };

  return (
    <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">

      {/* ─── SIDEBAR ────────────────────────────────────────────────── */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-16"} shrink-0 h-screen bg-gradient-to-b from-[#0a1628] via-[#0f2744] to-[#1a3a5c] text-white flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className={`px-4 py-5 border-b border-white/10 flex items-center ${sidebarOpen ? "gap-3" : "justify-center"}`}>
          <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center ring-1 ring-white/20 shadow-md">
            <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.25} />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1 }}>
                EPP MONITOR
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>
                Sistema de Seguridad
              </div>
            </div>
          )}
        </div>

        {/* Role badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-3 mb-1 px-3 py-2 rounded-md bg-white/5 border border-white/10">
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Módulo activo
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{user.rolLabel}</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                title={!sidebarOpen ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                  active
                    ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                style={{ fontSize: 13, fontWeight: 500 }}
              >
                <span className="shrink-0">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <div
                className={`h-9 w-9 rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md shrink-0`}
                style={{ fontSize: 12, fontWeight: 700 }}
              >
                {user.nombre[0]}{user.apelido[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
                  {user.nombre} {user.apelido}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
                  {user.rolLabel}
                </div>
              </div>
              <button onClick={handleLogout} className="text-white/60 hover:text-white transition-colors" title="Cerrar sesión">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md`}
                style={{ fontSize: 11, fontWeight: 700 }}
              >
                {user.nombre[0]}{user.apelido[0]}
              </div>
              <button onClick={handleLogout} className="text-white/60 hover:text-white transition-colors" title="Cerrar sesión">
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ─── MAIN ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Header */}
        <header className="bg-white border-b border-[#e5e5e5] px-4 h-14 flex items-center gap-3 shrink-0">

          {/* Botón toggle sidebar */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="h-8 w-8 rounded-md border border-[#d4d4d4] hover:border-[#3b82f6] hover:bg-blue-50 flex items-center justify-center transition-colors shrink-0"
            title={sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
          >
            {sidebarOpen
              ? <ChevronLeft size={15} className="text-[#6b6b6b]" />
              : <ChevronRight size={15} className="text-[#6b6b6b]" />
            }
          </button>

          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
            <input
              placeholder="Buscar en el sistema…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md bg-[#f5f5f5] focus:bg-white border border-transparent focus:border-[#3b82f6] outline-none transition-colors"
              style={{ fontSize: 13 }}
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f5f5]"
              style={{ fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] animate-pulse shadow-sm shadow-green-500/50" />
              Sistema en línea
            </span>
            <button className="relative h-9 w-9 rounded-md border border-[#d4d4d4] hover:border-[#ef4444] flex items-center justify-center transition-colors">
              <Bell size={15} className="text-[#6b6b6b]" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};