import { useMemo, useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2, X } from "lucide-react";
import { USUARIOS } from "./data";

const PAGE_SIZE = 5;

const EMPTY_FORM = {
  nombre: "",
  apellido: "",
  correo: "",
  rol: "Supervisor",
  empresa: "",
  estado: "Activo" as "Activo" | "Inactivo",
};

export function Usuarios() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setModalOpen(false);
    setForm(EMPTY_FORM);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return USUARIOS;
    return USUARIOS.filter((u) =>
      `${u.nombre} ${u.apellido} ${u.correo} ${u.rol} ${u.empresa}`.toLowerCase().includes(q),
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#000", letterSpacing: "-0.01em" }}>Gestión de Usuarios</div>
          <div className="mt-1" style={{ fontSize: 13, color: "#6b6b6b" }}>Administre los usuarios del sistema</div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="h-10 px-4 rounded-md bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all"
          style={{ fontSize: 13, fontWeight: 600 }}
        >
          <Plus size={16} /> Nuevo Usuario
        </button>
      </div>

      {/* Card */}
      <div className="bg-white border border-[#e5e5e5] rounded-lg">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-[#ececec] flex items-center justify-between gap-4">
          <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>
            Usuarios <span style={{ color: "#6b6b6b", fontWeight: 400 }}>· {filtered.length}</span>
          </div>
          <div className="relative w-72 max-w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
            <input
              placeholder="Buscar usuario…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="w-full h-9 pl-9 pr-3 rounded-md bg-[#f5f5f5] focus:bg-white border border-transparent focus:border-[#3b82f6] outline-none transition-colors"
              style={{ fontSize: 13 }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fafafa]">
              <tr className="border-b border-[#ececec]">
                {["#", "Nombre", "Correo", "Rol", "Empresa", "Estado", "Acciones"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3 ${h === "Acciones" || h === "Estado" ? "text-center" : "text-left"} ${h === "#" ? "w-12" : ""}`}
                    style={{ fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((u, idx) => (
                <tr key={u.id} className="border-b border-[#ececec] last:border-0 hover:bg-[#fafafa]">
                  <td className="px-4 py-3.5" style={{ fontSize: 13, color: "#6b6b6b", fontVariantNumeric: "tabular-nums" }}>
                    {start + idx + 1}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white flex items-center justify-center shadow-md shadow-purple-500/30" style={{ fontSize: 11, fontWeight: 700 }}>
                        {u.nombre[0]}{u.apellido[0]}
                      </div>
                      <div style={{ fontSize: 13, color: "#000", fontWeight: 500 }}>{u.nombre} {u.apellido}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5" style={{ fontSize: 13, color: "#1a1a1a" }}>{u.correo}</td>
                  <td className="px-4 py-3.5" style={{ fontSize: 13, color: "#1a1a1a" }}>{u.rol}</td>
                  <td className="px-4 py-3.5" style={{ fontSize: 13, color: "#1a1a1a" }}>{u.empresa}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className="inline-flex items-center rounded-full"
                      style={{
                        background: u.estado === "Activo" ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "#fff",
                        color: "#fff",
                        border: u.estado === "Activo" ? "none" : "1px solid #6b6b6b",
                        padding: "3px 12px",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        boxShadow: u.estado === "Activo" ? "0 2px 8px rgba(16, 185, 129, 0.3)" : "none",
                      }}
                    >
                      <span style={{ color: u.estado === "Activo" ? "#fff" : "#6b6b6b" }}>{u.estado}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        title="Editar"
                        className="h-8 w-8 rounded-md border border-[#e5e5e5] text-[#1a1a1a] hover:bg-gradient-to-br hover:from-[#8b5cf6] hover:to-[#7c3aed] hover:text-white hover:border-[#8b5cf6] flex items-center justify-center transition-all"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        title="Eliminar"
                        className="h-8 w-8 rounded-md border border-[#e5e5e5] text-[#1a1a1a] hover:bg-gradient-to-br hover:from-[#ef4444] hover:to-[#dc2626] hover:text-white hover:border-[#ef4444] flex items-center justify-center transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center" style={{ fontSize: 13, color: "#6b6b6b" }}>
                    Sin resultados para “{query}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="px-5 py-3.5 border-t border-[#ececec] flex items-center justify-between">
          <div style={{ fontSize: 12, color: "#6b6b6b" }}>
            Mostrando {filtered.length === 0 ? 0 : start + 1} a {Math.min(start + PAGE_SIZE, filtered.length)} de {filtered.length} usuarios
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="h-8 w-8 rounded-md border border-[#e5e5e5] flex items-center justify-center disabled:opacity-40 hover:border-[#3b82f6] transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 min-w-8 px-2.5 rounded-md border flex items-center justify-center transition-all ${
                  p === safePage ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white border-[#3b82f6] shadow-md shadow-blue-500/30" : "border-[#e5e5e5] text-[#1a1a1a] hover:border-[#3b82f6]"
                }`}
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="h-8 w-8 rounded-md border border-[#e5e5e5] flex items-center justify-center disabled:opacity-40 hover:border-[#3b82f6] transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Nuevo Usuario */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl ring-1 ring-black/10">
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#ececec]">
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Nuevo Usuario</div>
                <div className="mt-1" style={{ fontSize: 12, color: "#6b6b6b" }}>
                  Completa los datos para registrar un nuevo usuario en el sistema.
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="h-8 w-8 rounded-md text-[#6b6b6b] hover:bg-[#f5f5f5] flex items-center justify-center transition-colors"
                title="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                    Nombre
                  </label>
                  <input
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-[#d4d4d4] bg-white focus:border-[#7c3aed] outline-none transition-colors"
                    style={{ fontSize: 13 }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                    Apellido
                  </label>
                  <input
                    required
                    value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-[#d4d4d4] bg-white focus:border-[#7c3aed] outline-none transition-colors"
                    style={{ fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                  Correo electrónico
                </label>
                <input
                  required
                  type="email"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-[#d4d4d4] bg-white focus:border-[#7c3aed] outline-none transition-colors"
                  style={{ fontSize: 13 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                    Rol
                  </label>
                  <select
                    value={form.rol}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-[#d4d4d4] bg-white focus:border-[#7c3aed] outline-none transition-colors"
                    style={{ fontSize: 13 }}
                  >
                    <option>Supervisor</option>
                    <option>Encargado SSO</option>
                    <option>Administrador TI</option>
                    <option>Operario</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                    Estado
                  </label>
                  <select
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value as "Activo" | "Inactivo" })}
                    className="w-full h-10 px-3 rounded-md border border-[#d4d4d4] bg-white focus:border-[#7c3aed] outline-none transition-colors"
                    style={{ fontSize: 13 }}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                  Empresa
                </label>
                <input
                  required
                  value={form.empresa}
                  onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-[#d4d4d4] bg-white focus:border-[#7c3aed] outline-none transition-colors"
                  style={{ fontSize: 13 }}
                />
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ececec] -mx-6 px-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-10 px-4 rounded-md border border-[#d4d4d4] text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 rounded-md bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] shadow-lg shadow-purple-500/30 transition-all"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  Crear usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
