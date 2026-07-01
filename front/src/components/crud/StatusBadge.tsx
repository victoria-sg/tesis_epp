const STYLES: Record<
  string,
  { bg: string; color: string; border: string; shadow?: string }
> = {
  activo: {
    bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#fff",
    border: "none",
    shadow: "0 2px 6px rgba(16, 185, 129, 0.3)",
  },
  inactivo: {
    bg: "#fff",
    color: "#6b6b6b",
    border: "#d4d4d4",
  },
  online: {
    bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#fff",
    border: "none",
    shadow: "0 2px 6px rgba(16, 185, 129, 0.3)",
  },
  offline: {
    bg: "#fff",
    color: "#6b6b6b",
    border: "#d4d4d4",
  },
  pendiente: {
    bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#fff",
    border: "none",
    shadow: "0 2px 6px rgba(239, 68, 68, 0.3)",
  },
  mantenimiento: {
    bg: "#fff",
    color: "#f59e0b",
    border: "#f59e0b",
  },
  reproducida: {
    bg: "#fff",
    color: "#10b981",
    border: "#10b981",
  },
  silenciada: {
    bg: "#f5f5f5",
    color: "#6b6b6b",
    border: "#d4d4d4",
  },
  expirada: {
    bg: "#fff",
    color: "#b0b0b0",
    border: "#d4d4d4",
  },
};

interface Props {
  estado: string;
}

export const StatusBadge = ({ estado }: Props) => {
  const s = STYLES[estado.toLowerCase()] ?? STYLES.inactivo;

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
};
