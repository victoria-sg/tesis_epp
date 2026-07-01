import { useState, useEffect } from "react";
import { Camera, MapPin, Maximize2, Signal, WifiOff, X, Zap } from "lucide-react";
import { EstadoBadge, Label, SectionTitle, StatusDot } from "./ui-bits";
import { CAMARAS } from "./data";

type Camara = typeof CAMARAS[number];

// Simulated detection boxes that move around when active
const DETECTIONS = [
  { x: 15, y: 20, w: 18, h: 40, label: "Persona — Sin casco", color: "#ef4444" },
  { x: 55, y: 30, w: 16, h: 38, label: "Persona — OK", color: "#10b981" },
  { x: 72, y: 25, w: 15, h: 36, label: "Persona — OK", color: "#10b981" },
];

function CameraFeed({ camara, compact = false }: { camara: Camara; compact?: boolean }) {
  const [time, setTime] = useState(new Date());
  const [scanLine, setScanLine] = useState(0);
  const [detectionIdx, setDetectionIdx] = useState(0);

  useEffect(() => {
    if (camara.estado !== "activo") return;
    const t = setInterval(() => {
      setTime(new Date());
      setScanLine((s) => (s + 2) % 102);
    }, 80);
    return () => clearInterval(t);
  }, [camara.estado]);

  useEffect(() => {
    if (camara.estado !== "activo") return;
    const t = setInterval(() => setDetectionIdx((d) => (d + 1) % 3), 4000);
    return () => clearInterval(t);
  }, [camara.estado]);

  const isActive = camara.estado === "activo";
  const isMaintenance = camara.estado === "mantenimiento";
  const timeStr = time.toLocaleTimeString("es-PE", { hour12: false });
  const dateStr = time.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        aspectRatio: "16/9",
        background: isActive
          ? "linear-gradient(135deg, #0a0f1a 0%, #0d1520 40%, #0a1018 100%)"
          : "linear-gradient(135deg, #0a0a0a 0%, #111 100%)",
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* Scan lines overlay */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
          }}
        />
      )}

      {/* Moving scan line */}
      {isActive && (
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: `${scanLine}%`,
            height: 2,
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 120, 0.15), transparent)",
            transition: "top 0.08s linear",
          }}
        />
      )}

      {/* Vignette */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      )}

      {/* OFFLINE state */}
      {!isActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <WifiOff size={compact ? 24 : 36} className="text-white/20" />
          <div style={{ fontSize: compact ? 11 : 13, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            {isMaintenance ? "En mantenimiento" : "Sin señal"}
          </div>
          {/* Static noise effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />
        </div>
      )}

      {/* Active: simulated scene with people silhouettes */}
      {isActive && (
        <>
          {/* Ground plane hint */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "30%",
              background: "linear-gradient(0deg, rgba(20,30,15,0.6) 0%, transparent 100%)",
            }}
          />

          {/* AI detection boxes */}
          {DETECTIONS.map((det, i) => {
            const visible = detectionIdx === i || i !== 0;
            return (
              <div
                key={i}
                className="absolute transition-opacity duration-500"
                style={{
                  left: `${det.x + (i === detectionIdx ? 2 : 0)}%`,
                  top: `${det.y}%`,
                  width: `${det.w}%`,
                  height: `${det.h}%`,
                  border: `1.5px solid ${det.color}`,
                  opacity: visible ? 0.85 : 0.4,
                }}
              >
                {/* Corner markers */}
                {[
                  { top: -1, left: -1, borderTop: `2px solid ${det.color}`, borderLeft: `2px solid ${det.color}`, width: 8, height: 8 },
                  { top: -1, right: -1, borderTop: `2px solid ${det.color}`, borderRight: `2px solid ${det.color}`, width: 8, height: 8 },
                  { bottom: -1, left: -1, borderBottom: `2px solid ${det.color}`, borderLeft: `2px solid ${det.color}`, width: 8, height: 8 },
                  { bottom: -1, right: -1, borderBottom: `2px solid ${det.color}`, borderRight: `2px solid ${det.color}`, width: 8, height: 8 },
                ].map((corner, ci) => (
                  <div key={ci} className="absolute" style={{ ...corner, position: "absolute" }} />
                ))}
                {/* Label */}
                {!compact && (
                  <div
                    className="absolute -top-5 left-0 px-1.5 py-0.5 whitespace-nowrap"
                    style={{
                      background: det.color,
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {det.label}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Top-left: LIVE badge */}
      {isActive && (
        <div
          className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <span style={{ fontSize: compact ? 9 : 10, color: "#fff", fontWeight: 700, letterSpacing: "0.1em" }}>EN VIVO</span>
        </div>
      )}

      {/* Top-right: signal icon */}
      {isActive && (
        <div className="absolute top-2 right-2" style={{ color: "rgba(255,255,255,0.6)" }}>
          <Signal size={compact ? 12 : 14} />
        </div>
      )}
      {isMaintenance && (
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(217,119,6,0.8)" }}>
          <span style={{ fontSize: compact ? 9 : 10, color: "#fff", fontWeight: 700, letterSpacing: "0.08em" }}>MANTENIMIENTO</span>
        </div>
      )}

      {/* Bottom overlay: timestamp + camera code */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-2 py-1.5"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
      >
        <div>
          <div style={{ fontSize: compact ? 9 : 11, color: "rgba(255,255,255,0.9)", fontWeight: 700, letterSpacing: "0.06em" }}>
            {camara.nombre}
          </div>
          <div style={{ fontSize: compact ? 8 : 10, color: "rgba(255,255,255,0.55)" }}>
            {camara.ubicacion}
          </div>
        </div>
        {isActive && (
          <div className="text-right">
            <div style={{ fontSize: compact ? 9 : 11, color: "rgba(255,255,255,0.9)", fontVariantNumeric: "tabular-nums" }}>
              {timeStr}
            </div>
            <div style={{ fontSize: compact ? 8 : 10, color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
              {dateStr}
            </div>
          </div>
        )}
      </div>

      {/* AI badge bottom-left for active */}
      {isActive && !compact && (
        <div
          className="absolute bottom-10 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded"
          style={{ background: "rgba(59,130,246,0.8)", fontSize: 9, color: "#fff", fontWeight: 700 }}
        >
          <Zap size={9} /> IA ACTIVA
        </div>
      )}
    </div>
  );
}

export function Camaras() {
  const [selected, setSelected] = useState<Camara | null>(null);

  return (
    <div>
      <SectionTitle subtitle="Haz clic en cualquier cámara para ver el stream en pantalla completa.">
        Cámaras
      </SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CAMARAS.slice(0, 3).map((c) => (
          <div
            key={c.id}
            className="bg-white border border-[#d4d4d4] rounded-md overflow-hidden cursor-pointer hover:border-[#3b82f6] hover:shadow-md hover:shadow-blue-500/10 transition-all group"
            onClick={() => setSelected(c)}
          >
            <div className="relative">
              <CameraFeed camara={c} compact />
              {/* Hover expand hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 shadow-lg" style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>
                  <Maximize2 size={13} /> Ver stream
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>{c.nombre}</div>
                  <div className="flex items-center gap-1 mt-0.5" style={{ fontSize: 12, color: "#6b6b6b" }}>
                    <MapPin size={11} /> {c.zona}
                  </div>
                </div>
                <StatusDot estado={c.estado} />
              </div>
              <div className="mt-3 pt-3 border-t border-[#ececec] flex items-center justify-between">
                <span style={{ fontSize: 11, color: "#6b6b6b" }}>{c.ubicacion}</span>
                <EstadoBadge estado={c.estado} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#0d1117] rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-5 py-3 border-b border-white/10"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="flex items-center gap-3">
                <Camera size={16} className="text-white/60" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{selected.nombre}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                    {selected.zona} · {selected.ubicacion} · {selected.ip}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <EstadoBadge estado={selected.estado} />
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Feed */}
            <CameraFeed camara={selected} />

            {/* Footer */}
            <div
              className="px-5 py-3 border-t border-white/10 flex items-center justify-between"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="flex items-center gap-4">
                {[
                  { label: "Protocolo", value: "RTSP/H.264" },
                  { label: "Resolución", value: "1920×1080" },
                  { label: "FPS", value: selected.estado === "activo" ? "30" : "—" },
                  { label: "Latencia", value: selected.estado === "activo" ? "12 ms" : "—" },
                ].map((d) => (
                  <div key={d.label}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{d.label}</div>
                    <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{d.value}</div>
                  </div>
                ))}
              </div>

              {/* Navigate between cameras */}
              <div className="flex items-center gap-2">
                {CAMARAS.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`h-7 px-2.5 rounded transition-all ${
                      c.id === selected.id
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                    }`}
                    style={{ fontSize: 11, fontWeight: 600 }}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
