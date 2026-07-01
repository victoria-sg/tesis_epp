import { useState } from "react";
import { Search, X, Volume2 } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ConfianzaBar, EstadoBadge, Label, SectionTitle } from "./ui-bits";
import { FEED, ZONAS, TIPOS_EPP, type Incumplimiento } from "./data";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Incumplimientos() {
  const [selected, setSelected] = useState<Incumplimiento | null>(null);
  const [query, setQuery] = useState("");

  const filtered = FEED.filter((f) =>
    [f.zona, f.camara, f.epp].some((s) => s.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div>
      <SectionTitle subtitle="Registro completo de incumplimientos detectados con evidencia fotográfica.">
        Incumplimientos
      </SectionTitle>

      <div className="bg-white border border-[#d4d4d4] rounded-md p-4 mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" size={15} />
          <Input
            placeholder="Buscar por zona, cámara o EPP…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 rounded-md border-[1.5px] border-[#d4d4d4] focus-visible:border-[#3b82f6] focus-visible:ring-blue-500/10"
          />
        </div>
        <Select>
          <SelectTrigger className="h-10 rounded-md border-[1.5px] border-[#d4d4d4]"><SelectValue placeholder="Sede" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las sedes</SelectItem>
            <SelectItem value="lima">Lima Norte</SelectItem>
            <SelectItem value="callao">Callao</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="h-10 rounded-md border-[1.5px] border-[#d4d4d4]"><SelectValue placeholder="Zona" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las zonas</SelectItem>
            {ZONAS.map((z) => <SelectItem key={z.id} value={String(z.id)}>{z.nombre}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="h-10 rounded-md border-[1.5px] border-[#d4d4d4]"><SelectValue placeholder="Tipo EPP" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {TIPOS_EPP.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-[#d4d4d4] rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#ececec]">
              {["ID", "Fecha / Hora", "Zona", "Cámara", "EPP faltante", "Confianza", "Estado", "Evidencia"].map((h) => (
                <th key={h} className="text-left px-4 py-3" style={{ fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr
                key={f.id}
                onClick={() => setSelected(f)}
                className="border-b border-[#ececec] last:border-0 cursor-pointer hover:bg-[#fafafa] transition-colors"
              >
                <td className="px-4 py-3.5" style={{ fontSize: 12, color: "#6b6b6b", fontVariantNumeric: "tabular-nums" }}>#{f.id}</td>
                <td className="px-4 py-3.5" style={{ fontSize: 13, color: "#000", fontVariantNumeric: "tabular-nums" }}>{f.fecha}</td>
                <td className="px-4 py-3.5" style={{ fontSize: 13, color: "#000" }}>{f.zona}</td>
                <td className="px-4 py-3.5" style={{ fontSize: 13, color: "#6b6b6b" }}>{f.camara}</td>
                <td className="px-4 py-3.5" style={{ fontSize: 13, color: "#000", fontWeight: 500 }}>{f.epp}</td>
                <td className="px-4 py-3.5 w-40"><ConfianzaBar valor={f.confianza} /></td>
                <td className="px-4 py-3.5"><EstadoBadge estado={f.estado} /></td>
                <td className="px-4 py-3.5" style={{ fontSize: 12, color: "#6b6b6b" }}>Ver →</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setSelected(null)} />
          <div className="w-full max-w-md bg-white border-l border-[#d4d4d4] h-full overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
              <div>
                <Label>Incumplimiento #{selected.id}</Label>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#000", marginTop: 2 }}>{selected.epp}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#6b6b6b] hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-md overflow-hidden border border-[#d4d4d4] mb-5">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80"
                  alt={`Evidencia de incumplimiento — ${selected.epp}`}
                  className="w-full h-64 object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <Label>Fecha / Hora</Label>
                  <div style={{ fontSize: 13, color: "#000", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{selected.fecha}</div>
                </div>
                <div>
                  <Label>Zona</Label>
                  <div style={{ fontSize: 13, color: "#000", marginTop: 4 }}>{selected.zona}</div>
                </div>
                <div>
                  <Label>Cámara</Label>
                  <div style={{ fontSize: 13, color: "#000", marginTop: 4 }}>{selected.camara}</div>
                </div>
                <div>
                  <Label>Estado</Label>
                  <div className="mt-1"><EstadoBadge estado={selected.estado} /></div>
                </div>
                <div className="col-span-2">
                  <Label>Confianza del modelo</Label>
                  <div className="mt-2"><ConfianzaBar valor={selected.confianza} /></div>
                </div>
              </div>

              <div className="border-t border-[#ececec] pt-4">
                <Label>Alerta asociada</Label>
                <div className="mt-3 flex items-center justify-between p-3 rounded-md border border-[#d4d4d4]">
                  <div className="flex items-center gap-2">
                    <Volume2 size={15} className="text-[#8b5cf6]" />
                    <span style={{ fontSize: 13 }}>Alerta sonora · 8s</span>
                  </div>
                  <EstadoBadge estado={selected.estado} />
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  className="flex-1 h-11 rounded-md bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white transition-all shadow-lg shadow-green-500/30"
                  style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}
                >
                  Marcar atendida
                </button>
                <button
                  className="flex-1 h-11 rounded-md bg-white border border-[#d4d4d4] hover:border-[#f59e0b] transition-colors"
                  style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}
                >
                  Silenciar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
