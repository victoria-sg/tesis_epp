import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  AlertTriangle, Check, Edit2, Plus, Save, Trash2, Volume2, Wifi, WifiOff,
} from "lucide-react";
import { Label, SectionTitle } from "./ui-bits";
import {
  CAMARAS_TECH, IA_CALIBRACION, MATRIZ_EPP_INICIAL, SIRENAS, TIPOS_EPP, USUARIOS, ZONAS,
} from "./data";
import type { MatrizEPP, NivelEPP } from "./data";

type UsuarioRow = typeof USUARIOS[number] & { password?: string };

const NIVEL_STYLES: Record<NivelEPP, { bg: string; text: string; label: string }> = {
  "Obligatorio": { bg: "bg-red-100", text: "text-red-700", label: "Oblig." },
  "Opcional": { bg: "bg-amber-100", text: "text-amber-700", label: "Opcl." },
  "Desactivado": { bg: "bg-gray-100", text: "text-gray-500", label: "Off" },
};

const NIVELES: NivelEPP[] = ["Obligatorio", "Opcional", "Desactivado"];

function nextNivel(current: NivelEPP): NivelEPP {
  const idx = NIVELES.indexOf(current);
  return NIVELES[(idx + 1) % NIVELES.length];
}

export function DashboardTecnico() {
  const [matriz, setMatriz] = useState<MatrizEPP>(MATRIZ_EPP_INICIAL);
  const [savedZona, setSavedZona] = useState<number | null>(null);
  const [sirenFire, setSirenFire] = useState<number | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioRow[]>(USUARIOS.map((u) => ({ ...u })));
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<UsuarioRow>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: "", apellido: "", correo: "", rol: "Operario", empresa: "", password: "" });

  function cycleEPP(zonaId: number, epp: string) {
    setMatriz((prev) => ({
      ...prev,
      [zonaId]: {
        ...prev[zonaId],
        [epp]: nextNivel(prev[zonaId][epp] as NivelEPP),
      },
    }));
    setSavedZona(null);
  }

  function saveZona(zonaId: number) {
    setSavedZona(zonaId);
    setTimeout(() => setSavedZona(null), 2000);
  }

  function fireSiren(id: number) {
    setSirenFire(id);
    setTimeout(() => setSirenFire(null), 2000);
  }

  function startEdit(u: UsuarioRow) {
    setEditUserId(u.id);
    setEditForm({ ...u });
  }

  function saveEdit() {
    setUsuarios((prev) => prev.map((u) => (u.id === editUserId ? { ...u, ...editForm } : u)));
    setEditUserId(null);
    setEditForm({});
  }

  function deleteUser(id: number) {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  }

  function addUser() {
    if (!newUser.nombre || !newUser.correo) return;
    const maxId = Math.max(...usuarios.map((u) => u.id), 0);
    setUsuarios((prev) => [...prev, { ...newUser, id: maxId + 1, telefono: "", estado: "Activo" }]);
    setNewUser({ nombre: "", apellido: "", correo: "", rol: "Operario", empresa: "", password: "" });
    setShowAddForm(false);
  }

  const pieData = [
    { name: "Correctas", value: IA_CALIBRACION.totalAlertas - IA_CALIBRACION.falsosPositivos, color: "#10b981" },
    { name: "Falsos Positivos", value: IA_CALIBRACION.falsosPositivos, color: "#ef4444" },
  ];

  const errorOver = IA_CALIBRACION.porcentajeError >= IA_CALIBRACION.umbralRiesgo;

  return (
    <div className="space-y-4">
      <SectionTitle subtitle="Diagnóstico de red, salud de la IA y configuración del sistema — Administrador TI.">
        Dashboard Técnico
      </SectionTitle>

      {/* Row 1: EPP Matrix + AI Calibration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* EPP Matrix */}
        <div className="lg:col-span-2 bg-white border border-[#d4d4d4] rounded-md p-5">
          <div className="mb-4">
            <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Matriz EPP por Zona</div>
            <Label>Haz clic en cada celda para cambiar el nivel · Guardado en vivo sin reiniciar</Label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: 12 }}>
              <thead>
                <tr className="border-b border-[#ececec]">
                  <th className="px-3 py-2 text-left" style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>Zona</th>
                  {TIPOS_EPP.map((epp) => (
                    <th key={epp} className="px-2 py-2 text-center" style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {epp}
                    </th>
                  ))}
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ececec]">
                {ZONAS.map((z) => (
                  <tr key={z.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2" style={{ fontWeight: 500 }}>
                      <div style={{ fontSize: 12 }}>{z.nombre}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{z.sede}</div>
                    </td>
                    {TIPOS_EPP.map((epp) => {
                      const nivel = (matriz[z.id]?.[epp] ?? "Desactivado") as NivelEPP;
                      const s = NIVEL_STYLES[nivel];
                      return (
                        <td key={epp} className="px-2 py-2 text-center">
                          <button
                            onClick={() => cycleEPP(z.id, epp)}
                            className={`px-2 py-1 rounded-md text-xs font-semibold transition-all hover:opacity-80 ${s.bg} ${s.text}`}
                          >
                            {s.label}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2">
                      <button
                        onClick={() => saveZona(z.id)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
                          savedZona === z.id
                            ? "bg-emerald-500 text-white"
                            : "border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                        }`}
                        style={{ fontSize: 11, fontWeight: 600 }}
                      >
                        {savedZona === z.id ? <><Check size={11} /> Guardado</> : <><Save size={11} /> Guardar</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex gap-4" style={{ fontSize: 11, color: "#6b7280" }}>
            {(Object.entries(NIVEL_STYLES) as [NivelEPP, typeof NIVEL_STYLES[NivelEPP]][]).map(([k, s]) => (
              <span key={k} className={`flex items-center gap-1.5 px-2 py-0.5 rounded ${s.bg} ${s.text} font-semibold`}>{k}</span>
            ))}
          </div>
        </div>

        {/* AI Calibration */}
        <div className="bg-white border border-[#d4d4d4] rounded-md p-5">
          <div className="mb-3">
            <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Calibración de la IA</div>
            <Label>Alertas correctas vs falsos positivos</Label>
          </div>

          {errorOver && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-red-50 border border-red-200 mb-3">
              <AlertTriangle size={14} className="text-red-500 shrink-0" />
              <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 600 }}>Error &gt; {IA_CALIBRACION.umbralRiesgo}% — Se requiere re-entrenamiento</span>
            </div>
          )}

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "none", borderRadius: 6, color: "#fff", fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-gray-50 rounded p-2.5 text-center">
              <div style={{ fontSize: 11, color: "#6b7280" }}>Total Alertas</div>
              <div style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{IA_CALIBRACION.totalAlertas}</div>
            </div>
            <div className={`rounded p-2.5 text-center ${errorOver ? "bg-red-50" : "bg-emerald-50"}`}>
              <div style={{ fontSize: 11, color: "#6b7280" }}>Tasa Error</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: errorOver ? "#dc2626" : "#10b981", fontVariantNumeric: "tabular-nums" }}>
                {IA_CALIBRACION.porcentajeError}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Hardware panel */}
      <div className="bg-white border border-[#d4d4d4] rounded-md">
        <div className="px-5 py-4 border-b border-[#ececec]">
          <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Panel de Hardware — Cámaras y Sirenas IP</div>
          <Label>Estado en vivo · FPS · Latencia · Acciones de diagnóstico</Label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#ececec]">
          {/* Cameras */}
          <div>
            <div className="px-5 py-3 border-b border-[#ececec] bg-gray-50">
              <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>Cámaras IP</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontSize: 12 }}>
                <thead>
                  <tr className="border-b border-[#ececec]">
                    {["IP", "Código", "Zona", "Estado", "FPS", "Latencia"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ececec]">
                  {CAMARAS_TECH.slice(0, 3).map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 font-mono" style={{ fontSize: 11, color: "#6b7280" }}>{c.ip}</td>
                      <td className="px-4 py-2.5" style={{ fontWeight: 600 }}>{c.codigo}</td>
                      <td className="px-4 py-2.5" style={{ color: "#6b7280" }}>{c.zona.split(" — ")[1] || c.zona}</td>
                      <td className="px-4 py-2.5">
                        <span className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full ${
                          c.estado === "online" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                        }`} style={{ fontSize: 11, fontWeight: 600 }}>
                          {c.estado === "online" ? <Wifi size={10} /> : <WifiOff size={10} />}
                          {c.estado}
                        </span>
                      </td>
                      <td className="px-4 py-2.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {c.fps > 0 ? `${c.fps} fps` : <span style={{ color: "#9ca3af" }}>—</span>}
                      </td>
                      <td className="px-4 py-2.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {c.latencia > 0
                          ? <span style={{ color: c.latencia > 20 ? "#f59e0b" : "#10b981" }}>{c.latencia} ms</span>
                          : <span style={{ color: "#9ca3af" }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sirens */}
          <div>
            <div className="px-5 py-3 border-b border-[#ececec] bg-gray-50">
              <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>Sirenas IP</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontSize: 12 }}>
                <thead>
                  <tr className="border-b border-[#ececec]">
                    {["IP", "Código", "Zona", "Estado", "Prueba"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ececec]">
                  {SIRENAS.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 font-mono" style={{ fontSize: 11, color: "#6b7280" }}>{s.ip}</td>
                      <td className="px-4 py-2.5" style={{ fontWeight: 600 }}>{s.codigoSirena}</td>
                      <td className="px-4 py-2.5" style={{ color: "#6b7280" }}>{s.zona.split(" — ")[1] || s.zona}</td>
                      <td className="px-4 py-2.5">
                        <span className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full ${
                          s.estado === "online" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                        }`} style={{ fontSize: 11, fontWeight: 600 }}>
                          {s.estado === "online" ? <Wifi size={10} /> : <WifiOff size={10} />}
                          {s.estado}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => fireSiren(s.id)}
                          disabled={s.estado === "offline" || sirenFire !== null}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all ${
                            sirenFire === s.id
                              ? "bg-red-500 text-white animate-pulse"
                              : "border border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-600 disabled:opacity-30"
                          }`}
                          style={{ fontSize: 11, fontWeight: 600 }}
                        >
                          <Volume2 size={11} />
                          {sirenFire === s.id ? "Disparando…" : "Probar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: User management */}
      <div className="bg-white border border-[#d4d4d4] rounded-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Gestión de Accesos</div>
            <Label>CRUD de usuarios, roles y contraseñas</Label>
          </div>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] transition-all shadow-md shadow-purple-500/20"
            style={{ fontSize: 12, fontWeight: 600 }}
          >
            <Plus size={14} /> Nuevo Usuario
          </button>
        </div>

        {showAddForm && (
          <div className="px-5 py-4 border-b border-[#ececec] bg-purple-50/40">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(["nombre", "apellido", "correo", "empresa", "password"] as const).map((field) => (
                <div key={field}>
                  <label className="block mb-1" style={{ fontSize: 11, fontWeight: 600, textTransform: "capitalize", color: "#374151" }}>
                    {field === "password" ? "Contraseña" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "password" ? "password" : "text"}
                    value={newUser[field]}
                    onChange={(e) => setNewUser((u) => ({ ...u, [field]: e.target.value }))}
                    className="w-full h-8 px-2.5 rounded-md border border-[#d4d4d4] bg-white outline-none focus:border-purple-400"
                    style={{ fontSize: 12 }}
                  />
                </div>
              ))}
              <div>
                <label className="block mb-1" style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>Rol</label>
                <select
                  value={newUser.rol}
                  onChange={(e) => setNewUser((u) => ({ ...u, rol: e.target.value }))}
                  className="w-full h-8 px-2.5 rounded-md border border-[#d4d4d4] bg-white outline-none focus:border-purple-400"
                  style={{ fontSize: 12 }}
                >
                  {["Administrador TI", "Jefe de Seguridad", "Supervisor de Turno", "Encargado", "Operario"].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={addUser}
                disabled={!newUser.nombre || !newUser.correo}
                className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 transition-colors"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                Agregar
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                style={{ fontSize: 12 }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: 13 }}>
            <thead>
              <tr className="border-b border-[#ececec]">
                {["#", "Nombre", "Correo", "Rol", "Empresa", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ececec]">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3" style={{ color: "#9ca3af", fontVariantNumeric: "tabular-nums" }}>{u.id}</td>
                  <td className="px-4 py-3">
                    {editUserId === u.id ? (
                      <div className="flex gap-1">
                        <input
                          value={editForm.nombre ?? ""}
                          onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
                          className="w-20 h-7 px-2 rounded border border-blue-300 outline-none"
                          style={{ fontSize: 12 }}
                        />
                        <input
                          value={editForm.apellido ?? ""}
                          onChange={(e) => setEditForm((f) => ({ ...f, apellido: e.target.value }))}
                          className="w-20 h-7 px-2 rounded border border-blue-300 outline-none"
                          style={{ fontSize: 12 }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-7 w-7 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white flex items-center justify-center shrink-0"
                          style={{ fontSize: 10, fontWeight: 700 }}
                        >
                          {u.nombre[0]}{u.apellido[0]}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.nombre} {u.apellido}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#6b7280" }}>
                    {editUserId === u.id ? (
                      <input
                        value={editForm.correo ?? ""}
                        onChange={(e) => setEditForm((f) => ({ ...f, correo: e.target.value }))}
                        className="w-40 h-7 px-2 rounded border border-blue-300 outline-none"
                        style={{ fontSize: 12 }}
                      />
                    ) : u.correo}
                  </td>
                  <td className="px-4 py-3">
                    {editUserId === u.id ? (
                      <select
                        value={editForm.rol ?? ""}
                        onChange={(e) => setEditForm((f) => ({ ...f, rol: e.target.value }))}
                        className="h-7 px-2 rounded border border-blue-300 bg-white outline-none"
                        style={{ fontSize: 12 }}
                      >
                        {["Administrador TI", "Jefe de Seguridad", "Supervisor de Turno", "Encargado", "Operario"].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700" style={{ fontSize: 12, fontWeight: 600 }}>
                        {u.rol}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#6b7280" }}>{u.empresa}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      u.estado === "Activo" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {u.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {editUserId === u.id ? (
                        <button
                          onClick={saveEdit}
                          className="p-1.5 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Guardar"
                        >
                          <Check size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(u)}
                          className="p-1.5 rounded text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-1.5 rounded text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
