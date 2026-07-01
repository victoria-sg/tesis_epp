import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import {
  Activity, Clock, Download, ShieldCheck,
} from "lucide-react";
import { Label, SectionTitle } from "./ui-bits";
import {
  AUDITORIA, KPI_ANALITICO, TENDENCIA_7D, TOP_EPP_OLVIDADO, ZONAS_CRITICAS,
} from "./data";
import type { AuditoriaEntry, MetodoCierre } from "./data";

function KpiCard({
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
      {sub && <div className="mt-1" style={{ fontSize: 12, color: "#6b7280" }}>{sub}</div>}
    </div>
  );
}

const CIERRE_COLOR: Record<MetodoCierre, string> = {
  "Automático": "#10b981",
  "Manual — Justificado": "#3b82f6",
  "Manual — Falso Positivo": "#f59e0b",
  "Expirado": "#6b7280",
};

const CIERRE_BG: Record<MetodoCierre, string> = {
  "Automático": "bg-emerald-50 text-emerald-700",
  "Manual — Justificado": "bg-blue-50 text-blue-700",
  "Manual — Falso Positivo": "bg-amber-50 text-amber-700",
  "Expirado": "bg-gray-100 text-gray-600",
};

const NIVEL_COLOR: Record<string, string> = {
  alto: "bg-red-100 text-red-700",
  medio: "bg-amber-100 text-amber-700",
  bajo: "bg-emerald-100 text-emerald-700",
};

export function DashboardAnalitico() {
  const [fechaDesde, setFechaDesde] = useState("2026-05-31");
  const [fechaHasta, setFechaHasta] = useState("2026-06-01");
  const [filtroMetodo, setFiltroMetodo] = useState<MetodoCierre | "">("");

  const filtered = AUDITORIA.filter((e) => {
    const inRange = e.fecha >= fechaDesde && e.fecha <= fechaHasta;
    const methodMatch = !filtroMetodo || e.metodoCierre === filtroMetodo;
    return inRange && methodMatch;
  });

  function exportCSV() {
    const header = "ID,Fecha,Hora,Zona,EPP,Cámara,Confianza,Método de Cierre\n";
    const rows = filtered
      .map((e) =>
        `${e.id},${e.fecha},${e.hora},${e.zona},${e.epp},${e.camara},${Math.round(e.confianza * 100)}%,${e.metodoCierre}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria_epp_${fechaDesde}_${fechaHasta}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <SectionTitle subtitle="Análisis de tendencias, efectividad y reportes para el Encargado de Seguridad y Salud Ocupacional.">
        Dashboard Analítico
      </SectionTitle>

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          icon={<ShieldCheck size={16} />}
          label="Cumplimiento Global"
          value={`${KPI_ANALITICO.cumplimientoGlobal}%`}
          sub="Meta: 95% — por debajo del umbral"
          color="#10b981"
        />
        <KpiCard
          icon={<Activity size={16} />}
          label="Efectividad de la Sirena"
          value={`${KPI_ANALITICO.efectividadSirena}%`}
          sub="Alertas cerradas automáticamente"
          color="#3b82f6"
        />
        <KpiCard
          icon={<Clock size={16} />}
          label="Tiempo Prom. de Exposición"
          value={`${KPI_ANALITICO.tiempoPromedioExposicion} s`}
          sub="Segundos hasta corrección o atención"
          color="#f59e0b"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Line chart */}
        <div className="lg:col-span-2 bg-white border border-[#d4d4d4] rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Historial Semanal de Infracciones</div>
              <Label>Incumplimientos y alertas — últimos 7 días</Label>
            </div>
            <div className="flex gap-3" style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#f59e0b]" /> Incumplimientos</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#8b5cf6]" /> Alertas</span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TENDENCIA_7D} margin={{ top: 4, right: 12, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#ececec" vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="dia" stroke="#6b6b6b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b6b6b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "none", borderRadius: 6, color: "#fff", fontSize: 12 }} />
                <Line type="monotone" dataKey="incumplimientos" name="Incumplimientos" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} isAnimationActive={false} />
                <Line type="monotone" dataKey="alertas" name="Alertas" stroke="#8b5cf6" strokeWidth={2.5} strokeDasharray="5 5" dot={false} activeDot={{ r: 5 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone ranking */}
        <div className="bg-white border border-[#d4d4d4] rounded-md p-5">
          <div className="mb-4">
            <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Zonas Críticas</div>
            <Label>Ranking por número de incidencias</Label>
          </div>
          <ol className="space-y-2">
            {ZONAS_CRITICAS.map((z, i) => (
              <li key={z.zona} className="flex items-center gap-3">
                <span
                  className="h-6 w-6 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: i === 0 ? "#dc2626" : i === 1 ? "#f97316" : "#6b7280",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#000", lineHeight: 1.2 }}>{z.zona}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#000", fontVariantNumeric: "tabular-nums" }}>{z.incidencias}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${NIVEL_COLOR[z.nivel]}`}>{z.nivel}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white border border-[#d4d4d4] rounded-md p-5 mt-4">
        <div className="mb-4">
          <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Top EPP Olvidado</div>
          <Label>Frecuencia de incumplimiento por tipo de equipo</Label>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TOP_EPP_OLVIDADO} margin={{ top: 4, right: 12, bottom: 0, left: -20 }} barSize={28}>
              <CartesianGrid stroke="#ececec" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="epp" stroke="#6b6b6b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#6b6b6b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "none", borderRadius: 6, color: "#fff", fontSize: 12 }} />
              <Bar dataKey="total" name="Infracciones" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {TOP_EPP_OLVIDADO.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#dc2626" : index === 1 ? "#f97316" : index === 2 ? "#f59e0b" : "#3b82f6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Audit table */}
      <div className="bg-white border border-[#d4d4d4] rounded-md mt-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec] flex-wrap gap-3">
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Auditoría Histórica</div>
            <Label>Registro completo con método de cierre</Label>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="h-8 px-2.5 rounded-md border border-[#d4d4d4] bg-white outline-none focus:border-[#3b82f6]"
              style={{ fontSize: 12 }}
            />
            <span style={{ fontSize: 12, color: "#6b7280" }}>hasta</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="h-8 px-2.5 rounded-md border border-[#d4d4d4] bg-white outline-none focus:border-[#3b82f6]"
              style={{ fontSize: 12 }}
            />
            <select
              value={filtroMetodo}
              onChange={(e) => setFiltroMetodo(e.target.value as MetodoCierre | "")}
              className="h-8 px-2.5 rounded-md border border-[#d4d4d4] bg-white outline-none focus:border-[#3b82f6]"
              style={{ fontSize: 12 }}
            >
              <option value="">Todos los métodos</option>
              <option value="Automático">Automático</option>
              <option value="Manual — Justificado">Manual — Justificado</option>
              <option value="Manual — Falso Positivo">Manual — Falso Positivo</option>
              <option value="Expirado">Expirado</option>
            </select>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:from-[#2563eb] hover:to-[#1e40af] transition-all"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              <Download size={13} /> Exportar CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: 13 }}>
            <thead>
              <tr className="border-b border-[#ececec]">
                {["ID", "Fecha", "Hora", "Zona", "EPP", "Cámara", "Confianza", "Método de Cierre"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ececec]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center" style={{ fontSize: 13, color: "#9ca3af" }}>
                    No hay registros para los filtros seleccionados
                  </td>
                </tr>
              ) : (
                filtered.map((e: AuditoriaEntry) => (
                  <tr key={e.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="px-4 py-3" style={{ color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>#{e.id}</td>
                    <td className="px-4 py-3" style={{ color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>{e.fecha}</td>
                    <td className="px-4 py-3" style={{ color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>{e.hora}</td>
                    <td className="px-4 py-3" style={{ fontWeight: 500 }}>{e.zona}</td>
                    <td className="px-4 py-3">{e.epp}</td>
                    <td className="px-4 py-3" style={{ color: "#6b7280" }}>{e.camara}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 rounded-full bg-gray-100 flex-1" style={{ maxWidth: 60 }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.round(e.confianza * 100)}%`,
                              background: e.confianza >= 0.8 ? "#10b981" : e.confianza >= 0.6 ? "#f59e0b" : "#ef4444",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{Math.round(e.confianza * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${CIERRE_BG[e.metodoCierre]}`}
                      >
                        {e.metodoCierre}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-[#ececec] flex items-center justify-between">
          <span style={{ fontSize: 12, color: "#6b7280" }}>{filtered.length} registro{filtered.length !== 1 ? "s" : ""}</span>
          <div className="flex gap-3" style={{ fontSize: 11, color: "#6b7280" }}>
            {Object.entries(CIERRE_COLOR).map(([k, color]) => (
              <span key={k} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
