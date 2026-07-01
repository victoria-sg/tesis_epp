import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Label, SectionTitle, StatusDot } from "./ui-bits";
import { ZONAS, TIPOS_EPP } from "./data";

type Modo = "obligatorio" | "opcional" | "desactivado";

export function Zonas() {
  const [selectedId, setSelectedId] = useState(ZONAS[0].id);
  const [config, setConfig] = useState<Record<string, Modo>>({
    Casco: "obligatorio",
    Chaleco: "obligatorio",
    Guantes: "opcional",
    Botas: "obligatorio",
    Orejeras: "opcional",
    "Máscaras de soldar": "desactivado",
  });
  const [saved, setSaved] = useState(false);

  const selected = ZONAS.find((z) => z.id === selectedId)!;

  const setMode = (epp: string, mode: Modo) => {
    setConfig((c) => ({ ...c, [epp]: mode }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div>
      <SectionTitle subtitle="Configura las zonas y los EPP requeridos en cada una.">
        Zonas y EPPs Requeridos
      </SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <div className="bg-white border border-[#d4d4d4] rounded-md">
          <div className="px-4 py-3 border-b border-[#ececec]">
            <Label>Zonas configuradas</Label>
          </div>
          <ul>
            {ZONAS.map((z) => (
              <li key={z.id}>
                <button
                  onClick={() => setSelectedId(z.id)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between transition-all ${
                    selectedId === z.id ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white shadow-md shadow-blue-500/20" : "hover:bg-[#fafafa]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <StatusDot estado={z.estado} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{z.nombre}</div>
                      <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{z.sede} · {z.eppsCount} EPPs</div>
                    </div>
                  </div>
                  <ChevronRight size={15} className="opacity-50" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-[#d4d4d4] rounded-md p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#000" }}>{selected.nombre}</div>
              <div style={{ fontSize: 13, color: "#6b6b6b", marginTop: 2 }}>{selected.descripcion} · {selected.sede}</div>
            </div>
            {saved && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-green-500/30" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                <Check size={13} /> Guardado
              </div>
            )}
          </div>

          <div className="border-t border-[#ececec] pt-5">
            <Label>EPPs disponibles</Label>
            <div className="mt-4 space-y-2">
              {TIPOS_EPP.map((epp) => {
                const mode = config[epp] ?? "desactivado";
                return (
                  <div key={epp} className="flex items-center justify-between py-3 border-b border-[#ececec] last:border-0">
                    <span style={{ fontSize: 14, color: "#000", fontWeight: 500 }}>{epp}</span>
                    <div className="inline-flex rounded-md border border-[#d4d4d4] overflow-hidden">
                      {(["obligatorio", "opcional", "desactivado"] as Modo[]).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMode(epp, m)}
                          className={`px-3 py-1.5 transition-all ${
                            mode === m
                              ? m === "obligatorio"
                                ? "bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-md shadow-red-500/20"
                                : m === "opcional"
                                ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white shadow-md shadow-amber-500/20"
                                : "bg-gradient-to-r from-[#6b6b6b] to-[#525252] text-white shadow-md shadow-gray-500/20"
                              : "bg-white text-[#6b6b6b] hover:text-[#1a1a1a]"
                          }`}
                          style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
