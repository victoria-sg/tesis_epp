import { useState, useEffect } from "react";
import {
  AlertTriangle, CheckCircle, Eye, Flag, Volume2, VolumeX, X,
} from "lucide-react";
import { Label, SectionTitle } from "./ui-bits";
import { FEED, ZONAS } from "./data";

type ActiveAlert = {
  id: number;
  zona: string;
  camara: string;
  epp: string;
  confianza: number;
  fecha: string;
  tiempoSegundos: number;
};

const EPP_EMOJI: Record<string, string> = {
  "Casco": "⛑️",
  "Chaleco": "🦺",
  "Guantes": "🧤",
  "Botas": "👢",
  "Orejeras": "🎧",
  "Máscaras de soldar": "😷",
};

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export function DashboardOperativo() {
  const [alerts, setAlerts] = useState<ActiveAlert[]>(
    FEED.filter((f) => f.estado === "pendiente").map((f) => ({
      id: f.id,
      zona: f.zona,
      camara: f.camara,
      epp: f.epp,
      confianza: f.confianza,
      fecha: f.fecha,
      tiempoSegundos: 30 + Math.floor(Math.random() * 120),
    }))
  );
  const [sirenActive, setSirenActive] = useState(true);
  const [modalId, setModalId] = useState<number | null>(null);
  const [justifyId, setJustifyId] = useState<number | null>(null);
  const [justifyText, setJustifyText] = useState("");

  // Tick counters
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) => prev.map((a) => ({ ...a, tiempoSegundos: a.tiempoSegundos + 1 })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-silence siren after 10 s from first render
  useEffect(() => {
    if (!sirenActive) return;
    const t = setTimeout(() => setSirenActive(false), 10000);
    return () => clearTimeout(t);
  }, [sirenActive]);

  // Re-activate siren when new alert arrives
  useEffect(() => {
    if (alerts.length > 0) setSirenActive(true);
  }, [alerts.length]);

  function dismiss(id: number) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setJustifyId(null);
    setJustifyText("");
  }

  const alertZoneNames = new Set(alerts.map((a) => a.zona));
  const modalAlert = alerts.find((a) => a.id === modalId) ?? null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <SectionTitle subtitle="Monitoreo en tiempo real — control de excepciones para el Supervisor de Turno.">
          Dashboard Operativo
        </SectionTitle>

        {/* Siren indicator */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-700 ${
          sirenActive ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
        }`}>
          {sirenActive
            ? <Volume2 size={22} className="text-red-500 animate-pulse" />
            : <VolumeX size={22} className="text-gray-400" />}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: sirenActive ? "#dc2626" : "#9ca3af" }}>
              Sirena
            </div>
            <div style={{ fontSize: 11, color: sirenActive ? "#ef4444" : "#6b7280" }}>
              {sirenActive ? "ACTIVA" : "Silenciada"}
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Heat map */}
        <div className="bg-white border border-[#d4d4d4] rounded-md p-5">
          <div className="mb-4">
            <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Mapa de Calor — Planta</div>
            <Label>Estado por zona en tiempo real</Label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ZONAS.map((z) => {
              const hasAlert = alertZoneNames.has(z.nombre);
              const inactive = z.estado === "inactivo";
              return (
                <div
                  key={z.id}
                  className={`p-3 rounded-md transition-all duration-500 ${
                    hasAlert
                      ? "bg-red-500 text-white animate-pulse"
                      : inactive
                        ? "bg-gray-100 text-gray-400"
                        : "bg-emerald-500 text-white"
                  }`}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>
                    {z.nombre.includes(" — ") ? z.nombre.split(" — ")[1] : z.nombre}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.85, marginTop: 2 }}>
                    {hasAlert ? "⚠ FALTA ACTIVA" : inactive ? "Inactiva" : "✓ Segura"}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-3" style={{ fontSize: 10, color: "#6b7280" }}>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-red-500" /> Falta activa</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-emerald-500" /> Segura</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-gray-200" /> Inactiva</span>
          </div>
        </div>

        {/* Active alerts */}
        <div className="lg:col-span-2 bg-white border border-[#d4d4d4] rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Alertas Activas</div>
              <Label>Se cierran automáticamente si el operario se pone el EPP</Label>
            </div>
            {alerts.length > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 700 }}>{alerts.length} activa{alerts.length !== 1 ? "s" : ""}</span>
              </span>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <CheckCircle size={44} className="text-emerald-500" />
              <div style={{ fontSize: 15, fontWeight: 600, color: "#10b981" }}>Todas las zonas en cumplimiento</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>No hay infracciones activas en este momento</div>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border-2 border-red-200 rounded-md p-4 bg-red-50/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0 animate-pulse">{EPP_EMOJI[alert.epp] ?? "⚠️"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#dc2626" }}>
                          {alert.epp} no detectado
                        </span>
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-600 font-mono" style={{ fontSize: 11, fontWeight: 700 }}>
                          ⏱ {fmt(alert.tiempoSegundos)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>
                        📍 {alert.zona} · {alert.camara}
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{alert.fecha}</div>
                    </div>
                    <button
                      onClick={() => setModalId(alert.id)}
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                      style={{ fontSize: 12, fontWeight: 600 }}
                    >
                      <Eye size={13} /> Ver Foto
                    </button>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-red-100 flex-wrap">
                    <button
                      onClick={() => dismiss(alert.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                      style={{ fontSize: 12, fontWeight: 600 }}
                    >
                      <Flag size={12} /> Falso Positivo
                    </button>

                    {justifyId === alert.id ? (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <input
                          value={justifyText}
                          onChange={(e) => setJustifyText(e.target.value)}
                          placeholder="Motivo (ej: máquina apagada)…"
                          className="flex-1 h-8 px-2.5 rounded-md border border-gray-200 bg-white outline-none focus:border-blue-400 min-w-0"
                          style={{ fontSize: 12 }}
                          autoFocus
                        />
                        <button
                          onClick={() => dismiss(alert.id)}
                          disabled={!justifyText.trim()}
                          className="px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40 transition-colors"
                          style={{ fontSize: 12, fontWeight: 600 }}
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => { setJustifyId(null); setJustifyText(""); }}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setJustifyId(alert.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        style={{ fontSize: 12, fontWeight: 600 }}
                      >
                        <CheckCircle size={12} /> Justificar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Alertas resueltas hoy", value: "21", color: "#10b981" },
          { label: "Falsos positivos", value: "3", color: "#f59e0b" },
          { label: "Tiempo prom. reacción", value: "38 s", color: "#3b82f6" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#d4d4d4] rounded-md px-5 py-4 flex items-center gap-4">
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Evidence modal */}
      {modalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#ececec]">
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Foto de Evidencia</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{modalAlert.zona} · {modalAlert.camara}</div>
              </div>
              <button onClick={() => setModalId(null)} className="p-2 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              {/* Simulated camera frame */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-30">{EPP_EMOJI[modalAlert.epp]}</div>
                </div>
                {/* AI bounding box simulation */}
                <div
                  className="absolute border-2 border-red-500 rounded"
                  style={{ top: "20%", left: "30%", width: "35%", height: "55%" }}
                >
                  <div
                    className="absolute -top-6 left-0 bg-red-500 text-white rounded-sm px-2 py-0.5 whitespace-nowrap"
                    style={{ fontSize: 10, fontWeight: 700 }}
                  >
                    {modalAlert.epp} — NO DETECTADO · {Math.round(modalAlert.confianza * 100)}%
                  </div>
                </div>
                {/* Live badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 rounded px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span style={{ fontSize: 10, color: "#fff", fontWeight: 600 }}>EN VIVO · {modalAlert.camara}</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 rounded px-2 py-1">
                  <span style={{ fontSize: 10, color: "#fff" }}>{modalAlert.fecha}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "EPP Faltante", value: modalAlert.epp, color: "#dc2626" },
                  { label: "Confianza IA", value: `${Math.round(modalAlert.confianza * 100)}%`, color: "#000" },
                  { label: "Tiempo expuesto", value: fmt(modalAlert.tiempoSegundos), color: "#dc2626" },
                ].map((d) => (
                  <div key={d.label} className="bg-gray-50 rounded-md p-3">
                    <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: d.color, marginTop: 3 }}>{d.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { dismiss(modalAlert.id); setModalId(null); }}
                  className="flex-1 py-2.5 rounded-md border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  <Flag size={14} className="inline mr-1.5" /> Falso Positivo
                </button>
                <button
                  onClick={() => setModalId(null)}
                  className="flex-1 py-2.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
