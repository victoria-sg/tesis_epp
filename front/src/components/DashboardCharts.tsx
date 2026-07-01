import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { AlertTriangle, Camera, CheckCircle, Clock } from "lucide-react";
import api from "../services/api";

interface DashboardStats {
  alertas_por_dia: { dia: string; alertas: number }[];
  alertas_por_hora: { hora: string; alertas: number }[];
  alertas_por_zona: { zona: string; alertas: number; nivel_riesgo: string }[];
  resumen: {
    total: number;
    pendientes: number;
    resueltas: number;
    mes_actual: number;
    semana_actual: number;
    semana_anterior: number;
  };
  camaras: { total: number; activas: number };
  ultimas_alertas: { id: number; camara: number; estado: string; fecha: string | null }[];
}

type Rango = "1d" | "7d" | "30d";

const RANGOS: { value: Rango; label: string }[] = [
  { value: "1d", label: "Hoy" },
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
];

const COLORES_ZONA: Record<string, string> = {
  alto: "#ef4444",
  medio: "#f59e0b",
  bajo: "#22c55e",
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────
const AdminCharts = ({ stats, rango, setRango }: {
  stats: DashboardStats;
  rango: Rango;
  setRango: (r: Rango) => void;
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">

    {/* Alertas por rango — ocupa las 2 columnas */}
    <div className="bg-white border border-[#e5e5e5] rounded-lg p-5 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>
          Alertas — {rango === "1d" ? "Hoy" : rango === "7d" ? "Últimos 7 días" : "Últimos 30 días"}
        </div>
        <div className="flex gap-1">
          {RANGOS.map((r) => (
            <button
              key={r.value}
              onClick={() => setRango(r.value)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                rango === r.value
                  ? "bg-blue-600 text-white"
                  : "bg-[#f5f5f5] text-[#6b6b6b] hover:bg-[#ececec]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={stats.alertas_por_dia}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="alertas" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Alertas por zona */}
    <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
      <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 16 }}>
        Alertas por Zona
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={stats.alertas_por_zona}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="zona" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="alertas" radius={[4, 4, 0, 0]}>
            {stats.alertas_por_zona.map((entry, i) => (
              <Cell key={i} fill={COLORES_ZONA[entry.nivel_riesgo] ?? "#6b7280"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Estado alertas */}
    <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
      <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 16 }}>
        Estado de Alertas
      </div>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="50%" height={180}>
          <PieChart>
            <Pie
              data={[
                { name: "Pendientes", value: stats.resumen.pendientes },
                { name: "Resueltas", value: stats.resumen.resueltas },
              ]}
              cx="50%" cy="50%"
              innerRadius={50} outerRadius={75}
              dataKey="value"
            >
              <Cell fill="#ef4444" />
              <Cell fill="#22c55e" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span style={{ fontSize: 12, color: "#6b6b6b" }}>Pendientes</span>
            <span style={{ fontSize: 16, fontWeight: 700, marginLeft: "auto" }}>{stats.resumen.pendientes}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span style={{ fontSize: 12, color: "#6b6b6b" }}>Resueltas</span>
            <span style={{ fontSize: 16, fontWeight: 700, marginLeft: "auto" }}>{stats.resumen.resueltas}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span style={{ fontSize: 12, color: "#6b6b6b" }}>Este mes</span>
            <span style={{ fontSize: 16, fontWeight: 700, marginLeft: "auto" }}>{stats.resumen.mes_actual}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Comparativa semanas */}
    <div className="bg-white border border-[#e5e5e5] rounded-lg p-5 lg:col-span-2">
      <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 16 }}>
        Esta semana vs Semana anterior
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={[
          { semana: "Semana anterior", alertas: stats.resumen.semana_anterior },
          { semana: "Semana actual", alertas: stats.resumen.semana_actual },
        ]}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="alertas" radius={[4, 4, 0, 0]}>
            <Cell fill="#94a3b8" />
            <Cell fill="#3b82f6" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// ─── SUPERVISOR ───────────────────────────────────────────────────────────────
const SupervisorCharts = ({ stats }: { stats: DashboardStats }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
    <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
      <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 16 }}>
        Actividad — Últimas 8 horas
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={stats.alertas_por_hora}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="hora" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="alertas" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
      <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 16 }}>
        Estado de Cámaras
      </div>
      <div className="flex items-center justify-center gap-8 h-[200px]">
        <div className="text-center">
          <div style={{ fontSize: 48, fontWeight: 800, color: "#22c55e" }}>{stats.camaras.activas}</div>
          <div style={{ fontSize: 12, color: "#6b6b6b", marginTop: 4 }}>Online</div>
        </div>
        <div className="w-px h-16 bg-[#e5e5e5]" />
        <div className="text-center">
          <div style={{ fontSize: 48, fontWeight: 800, color: "#ef4444" }}>{stats.camaras.total - stats.camaras.activas}</div>
          <div style={{ fontSize: 12, color: "#6b6b6b", marginTop: 4 }}>Offline</div>
        </div>
        <div className="w-px h-16 bg-[#e5e5e5]" />
        <div className="text-center">
          <div style={{ fontSize: 48, fontWeight: 800, color: "#3b82f6" }}>{stats.camaras.total}</div>
          <div style={{ fontSize: 12, color: "#6b6b6b", marginTop: 4 }}>Total</div>
        </div>
      </div>
    </div>

    <div className="bg-white border border-[#e5e5e5] rounded-lg p-5 lg:col-span-2">
      <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 12 }}>
        Últimas Alertas del Turno
      </div>
      <div className="space-y-2">
        {stats.ultimas_alertas.length === 0 ? (
          <div style={{ fontSize: 13, color: "#6b6b6b", textAlign: "center", padding: "20px 0" }}>
            ✓ Sin alertas recientes
          </div>
        ) : stats.ultimas_alertas.map((a) => (
          <div key={a.id} className="flex items-center gap-3 px-3 py-2 rounded-md bg-[#f9f9f9] border border-[#ececec]">
            {a.estado === "Pendiente"
              ? <AlertTriangle size={14} className="text-red-500 shrink-0" />
              : <CheckCircle size={14} className="text-green-500 shrink-0" />
            }
            <span style={{ fontSize: 12, fontWeight: 500 }}>Alerta #{a.id}</span>
            <span style={{ fontSize: 11, color: "#6b6b6b" }}>Cámara {a.camara}</span>
            <span className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              a.estado === "Pendiente" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}>{a.estado}</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>
              {a.fecha
                ? new Date(a.fecha + "Z").toLocaleTimeString("es-EC", {
                    timeZone: "America/Guayaquil",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── JEFE DE PLANTA (SSO) ─────────────────────────────────────────────────────
const JefePlantaCharts = ({ stats }: { stats: DashboardStats }) => {
  const variacion = stats.resumen.semana_anterior > 0
    ? Math.round(((stats.resumen.semana_actual - stats.resumen.semana_anterior) / stats.resumen.semana_anterior) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <div className="bg-white border border-[#e5e5e5] rounded-lg p-5 lg:col-span-2">
        <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 16 }}>
          Resumen Ejecutivo del Mes
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Alertas este mes", value: stats.resumen.mes_actual, color: "#3b82f6", icon: <AlertTriangle size={18} /> },
            { label: "Pendientes", value: stats.resumen.pendientes, color: "#ef4444", icon: <Clock size={18} /> },
            { label: "Resueltas", value: stats.resumen.resueltas, color: "#22c55e", icon: <CheckCircle size={18} /> },
            { label: "Cámaras activas", value: `${stats.camaras.activas}/${stats.camaras.total}`, color: "#8b5cf6", icon: <Camera size={18} /> },
          ].map((kpi, i) => (
            <div key={i} className="rounded-lg p-4 border border-[#e5e5e5] text-center">
              <div className="flex justify-center mb-2" style={{ color: kpi.color }}>{kpi.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
              <div style={{ fontSize: 11, color: "#6b6b6b", marginTop: 4 }}>{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
        <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 4 }}>
          Tendencia Semanal
        </div>
        <div style={{ fontSize: 11, color: variacion > 0 ? "#ef4444" : "#22c55e", marginBottom: 12 }}>
          {variacion > 0
            ? `▲ ${variacion}% más que la semana pasada`
            : variacion < 0
              ? `▼ ${Math.abs(variacion)}% menos que la semana pasada`
              : "Sin cambios respecto a la semana pasada"}
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={stats.alertas_por_dia}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="alertas" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
        <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 16 }}>
          Infracciones por Zona
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={stats.alertas_por_zona}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="zona" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="alertas" radius={[4, 4, 0, 0]}>
              {stats.alertas_por_zona.map((entry, i) => (
                <Cell key={i} fill={COLORES_ZONA[entry.nivel_riesgo] ?? "#6b7280"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export const DashboardCharts = ({ rol }: { rol: string }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [rango, setRango] = useState<Rango>("7d");

  useEffect(() => {
    setLoading(true);
    api.get<DashboardStats>(`/stats/dashboard?rango=${rango}`)
      .then((r) => { setStats(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [rango]);

  if (loading) return (
    <div className="mt-4 h-32 flex items-center justify-center text-[#6b6b6b]">
      <span className="animate-pulse text-sm">Cargando estadísticas...</span>
    </div>
  );

  if (!stats) return null;

  if (rol === "admin") return (
    <>
      <AdminCharts stats={stats} rango={rango} setRango={setRango} />
      <div className="mt-2">
        <SupervisorCharts stats={stats} />
      </div>
      <div className="mt-2">
        <JefePlantaCharts stats={stats} />
      </div>
    </>
  );
  if (rol === "supervisor") return <SupervisorCharts stats={stats} />;
  if (rol === "sso") return <JefePlantaCharts stats={stats} />;
  return null;
};