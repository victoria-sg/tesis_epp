import { useState } from "react";
import {
  Activity, Bell, Camera, LayoutDashboard, LogOut, MapPin, Search,
  Shield, Siren, Users, Wrench,
} from "lucide-react";
import { DashboardOperativo } from "./DashboardOperativo";
import { DashboardAnalitico } from "./DashboardAnalitico";
import { DashboardTecnico } from "./DashboardTecnico";
import { Incumplimientos } from "./Incumplimientos";
import { Zonas } from "./Zonas";
import { Alertas } from "./Alertas";
import { Camaras } from "./Camaras";
import { Usuarios } from "./Usuarios";
import { ShieldCheck } from "lucide-react";
import type { LoggedUser } from "./data";

type View =
  | "dashboard-operativo"
  | "dashboard-analitico"
  | "dashboard-tecnico"
  | "usuarios"
  | "zonas"
  | "camaras"
  | "alertas"
  | "incumplimientos";

interface NavItem {
  id: View;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

function getNavItems(rol: LoggedUser["rol"]): NavItem[] {
  switch (rol) {
    case "supervisor":
      return [
        { id: "dashboard-operativo", label: "Dashboard Operativo", icon: <Shield size={16} /> },
        { id: "camaras", label: "Cámaras en vivo", icon: <Camera size={16} /> },
        { id: "alertas", label: "Alertas", icon: <Bell size={16} />, badge: 4 },
      ];
    case "sso":
      return [
        { id: "dashboard-analitico", label: "Dashboard Analítico", icon: <Activity size={16} /> },
        { id: "incumplimientos", label: "Incumplimientos", icon: <Siren size={16} /> },
        { id: "camaras", label: "Cámaras", icon: <Camera size={16} /> },
      ];
    case "admin":
      return [
        { id: "dashboard-tecnico", label: "Dashboard Técnico", icon: <Wrench size={16} /> },
        { id: "usuarios", label: "Gestión de Usuarios", icon: <Users size={16} /> },
        { id: "zonas", label: "Configuración de Zonas", icon: <MapPin size={16} /> },
        { id: "camaras", label: "Panel de Cámaras", icon: <Camera size={16} /> },
        { id: "alertas", label: "Alertas", icon: <Bell size={16} />, badge: 6 },
      ];
  }
}

function getDefaultView(rol: LoggedUser["rol"]): View {
  switch (rol) {
    case "supervisor": return "dashboard-operativo";
    case "sso": return "dashboard-analitico";
    case "admin": return "dashboard-tecnico";
  }
}

const ROLE_COLOR: Record<LoggedUser["rol"], string> = {
  supervisor: "#3b82f6",
  sso: "#10b981",
  admin: "#8b5cf6",
};

const ROLE_GRADIENT: Record<LoggedUser["rol"], string> = {
  supervisor: "from-[#3b82f6] to-[#2563eb]",
  sso: "from-[#10b981] to-[#059669]",
  admin: "from-[#8b5cf6] to-[#7c3aed]",
};

interface Props {
  user: LoggedUser;
  onLogout: () => void;
}

export function AppShell({ user, onLogout }: Props) {
  const navItems = getNavItems(user.rol);
  const [view, setView] = useState<View>(getDefaultView(user.rol));

  return (
    <div className="h-screen flex bg-[#f5f5f5] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 h-screen bg-gradient-to-b from-[#0a1628] via-[#0f2744] to-[#1a3a5c] text-white flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center ring-1 ring-white/20 shadow-md">
            <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.25} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1 }}>EPP MONITOR</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 4 }}>
              Sistema de Seguridad
            </div>
          </div>
        </div>

        {/* Role badge */}
        <div className="mx-3 mt-3 mb-1 px-3 py-2 rounded-md bg-white/5 border border-white/10">
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Módulo activo</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: ROLE_COLOR[user.rol] }}
            />
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{user.rolLabel}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                  active
                    ? `bg-gradient-to-r ${ROLE_GRADIENT[user.rol]} text-white shadow-lg`
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                style={{ fontSize: 13, fontWeight: 500 }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && !active && (
                  <span
                    className="ml-auto px-1.5 rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white"
                    style={{ fontSize: 10, fontWeight: 700, minWidth: 18, textAlign: "center" }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div
              className={`h-9 w-9 rounded-full bg-gradient-to-br ${ROLE_GRADIENT[user.rol]} text-white flex items-center justify-center shadow-md`}
              style={{ fontSize: 12, fontWeight: 700 }}
            >
              {user.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
                {user.nombre} {user.apellido}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
                {user.rolLabel}
              </div>
            </div>
            <button onClick={onLogout} className="text-white/60 hover:text-white transition-colors" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="bg-white border-b border-[#e5e5e5] px-6 h-14 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
            <input
              placeholder="Buscar incumplimientos, cámaras, zonas…"
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
              <Bell size={15} />
              <span
                className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white flex items-center justify-center shadow-md shadow-red-500/30"
                style={{ fontSize: 9, fontWeight: 700 }}
              >
                {user.rol === "supervisor" ? 4 : 6}
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {view === "dashboard-operativo" && <DashboardOperativo />}
          {view === "dashboard-analitico" && <DashboardAnalitico />}
          {view === "dashboard-tecnico" && <DashboardTecnico />}
          {view === "incumplimientos" && <Incumplimientos />}
          {view === "zonas" && <Zonas />}
          {view === "alertas" && <Alertas />}
          {view === "camaras" && <Camaras />}
          {view === "usuarios" && <Usuarios />}
        </main>
      </div>
    </div>
  );
}
