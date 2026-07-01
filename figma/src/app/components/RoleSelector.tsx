import { ShieldCheck, HardHat, Cog, ArrowRight, Lock } from "lucide-react";
import { DEMO_USERS } from "./data";
import type { LoggedUser } from "./data";

interface Props {
  onSelect: (user: LoggedUser) => void;
}

type RoleStyle = {
  gradient: string;
  ring: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ReactNode;
  hex: string;
};

const ROLE_STYLES: Record<LoggedUser["rol"], RoleStyle> = {
  supervisor: {
    gradient: "from-[#2563eb] to-[#1d4ed8]",
    ring: "hover:ring-[#2563eb]/30 hover:border-[#2563eb]",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    icon: <HardHat className="w-7 h-7 text-white" />,
    hex: "#2563eb",
  },
  sso: {
    gradient: "from-[#f97316] to-[#ea580c]",
    ring: "hover:ring-[#f97316]/30 hover:border-[#f97316]",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-700",
    icon: <ShieldCheck className="w-7 h-7 text-white" />,
    hex: "#f97316",
  },
  admin: {
    gradient: "from-[#7c3aed] to-[#6d28d9]",
    ring: "hover:ring-[#7c3aed]/30 hover:border-[#7c3aed]",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    icon: <Cog className="w-7 h-7 text-white" />,
    hex: "#7c3aed",
  },
};

const ROLE_INFO: Record<
  LoggedUser["rol"],
  { title: string; subtitle: string; desc: string; perks: string[] }
> = {
  supervisor: {
    title: "Supervisor de Turno",
    subtitle: "Operación en tiempo real",
    desc: "Monitorea alertas activas, mapa de calor y respuesta de sirena en planta.",
    perks: ["Alertas en vivo", "Mapa de zonas", "Justificación"],
  },
  sso: {
    title: "Encargado de SSO",
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

export function RoleSelector({ onSelect }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/40" />

      <div className="relative z-10 w-full max-w-2xl my-auto bg-white rounded-2xl shadow-2xl ring-1 ring-black/10 p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div className="text-left">
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "0.02em", lineHeight: 1 }}>
                EPP Monitor
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 5 }}>
                Sistema de Gestión
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>
            Bienvenido al sistema
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", marginTop: 8 }}>
            Selecciona el perfil con el que deseas iniciar sesión
          </p>
        </div>

        {/* Role list */}
        <div className="flex flex-col gap-4">
          {DEMO_USERS.map((user) => {
            const style = ROLE_STYLES[user.rol];
            const info = ROLE_INFO[user.rol];

            return (
              <button
                key={user.rol}
                onClick={() => onSelect(user)}
                className={`group flex items-center gap-5 text-left rounded-xl bg-white border border-slate-200 px-5 py-4 transition-all hover:shadow-md ${style.ring}`}
              >
                <div
                  className={`shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-md`}
                >
                  {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
                    {info.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, lineHeight: 1.4 }}>
                    {info.subtitle}
                  </div>
                </div>
                <ArrowRight
                  className="shrink-0 w-5 h-5 transition-transform group-hover:translate-x-1"
                  style={{ color: style.hex }}
                />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500">
          <Lock className="w-3.5 h-3.5" />
          <span style={{ fontSize: 11 }}>
            Conexión segura · Seguridad que te protege, tecnología que te cuida.
          </span>
        </div>
      </div>
    </div>
  );
}
