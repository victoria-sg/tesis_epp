import { Activity, AlertTriangle, Camera, MapPin } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ConfianzaBar, EstadoBadge, Label, SectionTitle } from "./ui-bits";
import { FEED, HEATMAP_ZONAS, KPIS, TENDENCIA_7D } from "./data";

function Kpi({
  icon, label, value, sub, color = "#3b82f6",
}: { icon: React.ReactNode; label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-white border border-[#d4d4d4] rounded-md p-5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="mt-3" style={{ fontSize: 30, fontWeight: 700, color: "#000", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
        {value}
      </div>
      {sub && <div className="mt-1" style={{ fontSize: 12, color: "#6b6b6b" }}>{sub}</div>}
    </div>
  );
}

export function Dashboard() {
  return (
    <div>
      <SectionTitle subtitle="Monitoreo en tiempo real del cumplimiento de EPP en todas las zonas.">
        Dashboard
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={<MapPin size={16} />} label="Zonas activas" value={`${KPIS.zonasActivas}/${KPIS.zonasTotal}`} sub="2 zonas en pausa" color="#10b981" />
        <Kpi icon={<Camera size={16} />} label="Cámaras en línea" value={`${KPIS.camarasOnline}/${KPIS.camarasTotal}`} sub="4 fuera de servicio" color="#3b82f6" />
        <Kpi icon={<Activity size={16} />} label="Incumplimientos hoy" value={String(KPIS.incumplimientosHoy)} sub="+18% vs ayer" color="#f59e0b" />
        <Kpi icon={<AlertTriangle size={16} />} label="Alertas pendientes" value={String(KPIS.alertasPendientes)} sub="Requieren atención" color="#ef4444" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 bg-white border border-[#d4d4d4] rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Tendencia — Últimos 7 días</div>
              <Label>Incumplimientos vs Alertas</Label>
            </div>
            <div className="flex gap-3" style={{ fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#f59e0b]" /> Incumplimientos</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#8b5cf6]" /> Alertas</span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TENDENCIA_7D.map((d, i) => ({ ...d, id: i }))} margin={{ top: 5, right: 12, bottom: 0, left: -20 }}>
                <CartesianGrid key="grid" stroke="#ececec" vertical={false} strokeDasharray="3 3" />
                <XAxis key="xaxis" dataKey="dia" stroke="#6b6b6b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis key="yaxis" stroke="#6b6b6b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip key="tooltip" contentStyle={{ background: "#1a1a1a", border: "none", borderRadius: 6, color: "#fff", fontSize: 12 }} />
                <Line
                  key="line-incumplimientos"
                  type="monotone"
                  dataKey="incumplimientos"
                  name="Incumplimientos"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
                <Line
                  key="line-alertas"
                  type="monotone"
                  dataKey="alertas"
                  name="Alertas"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#d4d4d4] rounded-md p-5">
          <div className="mb-4">
            <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Mapa de calor</div>
            <Label>Nivel de incumplimiento por zona</Label>
          </div>
          <div className="space-y-2.5">
            {HEATMAP_ZONAS.map((z) => {
              const intensity = z.nivel;
              const bg = intensity > 0.7
                ? `linear-gradient(135deg, #dc2626 ${intensity * 100}%, #ef4444 100%)`
                : intensity > 0.4
                ? `linear-gradient(135deg, #f59e0b ${intensity * 100}%, #fbbf24 100%)`
                : `linear-gradient(135deg, #10b981 ${intensity * 100}%, #34d399 100%)`;
              const text = intensity > 0.55 ? "#fff" : "#000";
              return (
                <div key={z.zona} className="flex items-center justify-between rounded-md px-3 py-2.5" style={{ background: bg, color: text }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{z.zona}</span>
                  <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{Math.round(z.nivel * 100)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#d4d4d4] rounded-md mt-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Feed en tiempo real</div>
            <Label>Últimas detecciones e incumplimientos</Label>
          </div>
          <span className="flex items-center gap-2" style={{ fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] animate-pulse shadow-sm shadow-blue-500/50" /> En vivo
          </span>
        </div>
        <ul className="divide-y divide-[#ececec]">
          {FEED.slice(0, 6).map((f) => (
            <li key={f.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#fafafa] transition-colors">
              <span style={{ fontSize: 12, color: "#6b6b6b", fontVariantNumeric: "tabular-nums", minWidth: 140 }}>
                {f.fecha.split(" ")[1]} · {f.fecha.split(" ")[0]}
              </span>
              <span style={{ fontSize: 13, color: "#000", minWidth: 170 }}>{f.zona}</span>
              <span style={{ fontSize: 12, color: "#6b6b6b", minWidth: 80 }}>{f.camara}</span>
              <span style={{ fontSize: 13, color: "#000", flex: 1, fontWeight: 500 }}>{f.epp}</span>
              <div className="w-40"><ConfianzaBar valor={f.confianza} /></div>
              <EstadoBadge estado={f.estado} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
