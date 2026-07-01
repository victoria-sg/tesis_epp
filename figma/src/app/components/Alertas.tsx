import { useState } from "react";
import { Bell, BellOff, Check, Volume2 } from "lucide-react";
import { EstadoBadge, Label, SectionTitle } from "./ui-bits";
import { FEED } from "./data";

export function Alertas() {
  const [items, setItems] = useState(FEED);
  const pendientes = items.filter((i) => i.estado === "pendiente");

  return (
    <div>
      <SectionTitle subtitle="Notificaciones en tiempo real de incumplimientos críticos.">
        Alertas
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white rounded-md p-5 shadow-lg shadow-red-500/30">
          <div className="flex items-center justify-between">
            <Label><span className="text-white/70">Pendientes</span></Label>
            <Bell size={16} />
          </div>
          <div className="mt-3" style={{ fontSize: 30, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
            {pendientes.length}
          </div>
        </div>
        {(["reproducida", "silenciada", "expirada"] as const).map((est) => (
          <div key={est} className="bg-white border border-[#d4d4d4] rounded-md p-5">
            <div className="flex items-center justify-between">
              <Label>{est}</Label>
              <EstadoBadge estado={est} />
            </div>
            <div className="mt-3" style={{ fontSize: 30, fontWeight: 700, color: "#000", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
              {items.filter((i) => i.estado === est).length}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#d4d4d4] rounded-md">
        <div className="px-5 py-4 border-b border-[#ececec] flex items-center justify-between">
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Cola de alertas</div>
            <Label>Atiende incumplimientos pendientes</Label>
          </div>
        </div>
        <ul>
          {items.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-4 px-5 py-4 border-b border-[#ececec] last:border-0"
              style={{
                animation: a.estado === "pendiente" ? "pulse-border 2s ease-in-out infinite" : "none",
                borderLeft: a.estado === "pendiente" ? "3px solid #ef4444" : "3px solid transparent",
              }}
            >
              <div className={`h-10 w-10 rounded-md flex items-center justify-center ${a.estado === "pendiente" ? "bg-gradient-to-br from-[#ef4444] to-[#dc2626] shadow-md shadow-red-500/30" : "bg-[#f5f5f5]"}`}>
                <Volume2 size={16} className={a.estado === "pendiente" ? "text-white" : "text-[#b0b0b0]"} />
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 14, color: "#000", fontWeight: 500 }}>
                  {a.epp} no detectado · {a.zona}
                </div>
                <div style={{ fontSize: 12, color: "#6b6b6b", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
                  #{a.id} · {a.camara} · {a.fecha.split(" ")[1]}
                </div>
              </div>
              <EstadoBadge estado={a.estado} />
              <button
                disabled={a.estado !== "pendiente"}
                onClick={() => setItems((it) => it.map((x) => x.id === a.id ? { ...x, estado: "silenciada" } : x))}
                className="h-9 w-9 rounded-md border border-[#d4d4d4] hover:border-[#f59e0b] flex items-center justify-center disabled:opacity-30 transition-colors"
                title="Silenciar"
              >
                <BellOff size={14} />
              </button>
              <button
                disabled={a.estado !== "pendiente"}
                onClick={() => setItems((it) => it.map((x) => x.id === a.id ? { ...x, estado: "reproducida" } : x))}
                className="h-9 px-3 rounded-md bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] flex items-center gap-1.5 disabled:bg-[#d4d4d4] disabled:text-[#9a9a9a] shadow-md shadow-green-500/30 disabled:shadow-none transition-all"
                style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}
              >
                <Check size={13} /> Atender
              </button>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes pulse-border {
          0%, 100% { border-left-color: #ef4444; }
          50% { border-left-color: #fca5a5; }
        }
      `}</style>
    </div>
  );
}
