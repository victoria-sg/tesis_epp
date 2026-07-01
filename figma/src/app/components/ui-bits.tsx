import { ReactNode } from "react";

export function Label({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div style={{ fontSize: 22, fontWeight: 700, color: "#000", letterSpacing: "-0.01em" }}>{children}</div>
      {subtitle && <div className="mt-1" style={{ fontSize: 13, color: "#6b6b6b" }}>{subtitle}</div>}
    </div>
  );
}

export function StatusDot({ estado }: { estado: string }) {
  const isActive = estado === "activo";
  const isMaintenance = estado === "mantenimiento";
  const color = isActive
    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    : isMaintenance
    ? "#f59e0b"
    : "#d4d4d4";
  const shadow = isActive ? "0 2px 4px rgba(16, 185, 129, 0.4)" : isMaintenance ? "0 2px 4px rgba(245, 158, 11, 0.4)" : "none";
  return <span className="inline-block h-2 w-2 rounded-full" style={{ background: color, boxShadow: shadow }} />;
}

export function ConfianzaBar({ valor }: { valor: number }) {
  const pct = Math.round(valor * 100);
  let gradient: string;
  let textColor: string;

  if (valor >= 0.8) {
    gradient = "linear-gradient(90deg, #10b981 0%, #059669 100%)";
    textColor = "#10b981";
  } else if (valor >= 0.6) {
    gradient = "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)";
    textColor = "#f59e0b";
  } else {
    gradient = "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)";
    textColor = "#ef4444";
  }

  return (
    <div className="flex items-center gap-2 w-full min-w-[120px]">
      <div className="flex-1 h-1.5 rounded-full bg-[#ececec] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: gradient }}
        />
      </div>
      <span style={{ fontSize: 12, color: textColor, fontVariantNumeric: "tabular-nums", minWidth: 32, textAlign: "right", fontWeight: 600 }}>
        {pct}%
      </span>
    </div>
  );
}

export function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, { bg: string; color: string; border: string; shadow?: string }> = {
    pendiente:   { bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "#fff", border: "none", shadow: "0 2px 6px rgba(239, 68, 68, 0.3)" },
    reproducida: { bg: "#fff", color: "#10b981", border: "#10b981" },
    silenciada:  { bg: "#f5f5f5", color: "#6b6b6b", border: "#d4d4d4" },
    expirada:    { bg: "#fff", color: "#b0b0b0", border: "#d4d4d4" },
    activo:      { bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#fff", border: "none", shadow: "0 2px 6px rgba(16, 185, 129, 0.3)" },
    inactivo:    { bg: "#fff", color: "#6b6b6b", border: "#d4d4d4" },
    mantenimiento: { bg: "#fff", color: "#f59e0b", border: "#f59e0b" },
  };
  const s = map[estado] ?? map.inactivo;
  return (
    <span
      className="inline-flex items-center rounded-full"
      style={{
        background: s.bg,
        color: s.color,
        border: s.border !== "none" ? `1px solid ${s.border}` : "none",
        padding: "2px 10px",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontWeight: 500,
        boxShadow: s.shadow || "none",
      }}
    >
      {estado}
    </span>
  );
}
