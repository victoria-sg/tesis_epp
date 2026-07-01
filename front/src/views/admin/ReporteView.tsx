import React, { useState } from "react";
import { AlertTriangle, CheckCircle, Clock, Download, FileWarning, X } from "lucide-react";
import { CustomTable, type Column } from "../../components/crud/CustomTable";
import { PageHeader } from "../../components/crud/PageHeader";
import { SearchBar } from "../../components/crud/SearchBar";
import { StatusBadge } from "../../components/crud/StatusBadge";
import { useReportes } from "../../controllers/useReportes";
import type { AlertaReporte } from "../../models/reporte.model";

const formatearFecha = (iso: string | null): string => {
  if (!iso) return "—";
  // El backend guarda en UTC sin 'Z', hay que indicárselo al parser
  const fechaUtc = iso.endsWith("Z") || iso.includes("+") ? iso : iso + "Z";
  const fecha = new Date(fechaUtc);
  if (Number.isNaN(fecha.getTime())) return "—";
  return fecha.toLocaleString("es-EC", {
    timeZone: "America/Guayaquil",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatearDuracion = (segundos: number | null): string => {
  if (segundos === null) return "—";
  if (segundos < 60) return `${segundos} s`;
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  return `${minutos} min ${resto} s`;
};

export const ReportesView = () => {
  const {
    data,
    totalSinFiltrar,
    loading,
    error,
    query,
    setQuery,
    exportarCsv,
    stats,
    alertaResolviendo,
    comentario,
    setComentario,
    resolviendoLoading,
    resolviendoError,
    abrirModalResolucion,
    cerrarModalResolucion,
    resolverAlerta,
  } = useReportes();

  const [imagenExpandida, setImagenExpandida] = useState<string | null>(null);

  const columns: Column<AlertaReporte>[] = [
    {
      key: "captura_frame",
      header: "Captura",
      width: "80px",
      render: (a) =>
        a.captura_frame ? (
          <img
            src={a.captura_frame}
            alt="Captura"
            onClick={() => setImagenExpandida(a.captura_frame)}
            className="w-14 h-10 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity border border-[#e5e5e5]"
          />
        ) : (
          <span style={{ color: "#d4d4d4", fontSize: 11 }}>Sin captura</span>
        ),
    },
    {
      key: "fecha_hora_deteccion",
      header: "Fecha",
      render: (a) => formatearFecha(a.fecha_hora_deteccion),
    },
    { key: "nombre_zona", header: "Zona" },
    { key: "codigo_camara", header: "Cámara" },
    {
      key: "segundos_transcurridos",
      header: "Duración",
      render: (a) => formatearDuracion(a.segundos_transcurridos),
    },
    {
      key: "estado_alerta",
      header: "Estado",
      render: (a) =>
        a.estado_alerta ? <StatusBadge estado={a.estado_alerta} /> : "—",
    },
    {
      key: "comentario_resolucion",
      header: "Justificación",
      render: (a) =>
        a.comentario_resolucion ? (
          <span className="text-xs">{a.comentario_resolucion}</span>
        ) : (
          <span style={{ color: "#9a9a9a", fontSize: 12 }}>Sin atender</span>
        ),
    },
    {
      key: "resuelto_por",
      header: "Resuelto por",
      render: (a) => a.resuelto_por ?? "—",
    },
    {
      key: "acciones",
      header: "Acciones",
      align: "center",
      width: "100px",
      render: (a) =>
        a.estado_alerta === "Pendiente" ? (
          <button
            onClick={() => abrirModalResolucion(a)}
            className="px-3 py-1.5 rounded-md bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] transition-all shadow-sm"
            style={{ fontSize: 11, fontWeight: 600 }}
          >
            Resolver
          </button>
        ) : (
          <span className="flex items-center justify-center gap-1 text-green-600" style={{ fontSize: 11 }}>
            <CheckCircle size={12} /> Resuelta
          </span>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reportes de Alertas"
        subtitle="Historial de alertas detectadas, su estado y justificación"
        action={
          <button
            onClick={exportarCsv}
            disabled={data.length === 0}
            className="h-10 px-4 rounded-md bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all disabled:opacity-40 disabled:shadow-none"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Download size={16} /> Exportar CSV
          </button>
        }
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[#e5e5e5] rounded-lg p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <AlertTriangle size={18} className="text-blue-600" />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#000" }}>{stats.total}</div>
            <div style={{ fontSize: 11, color: "#6b6b6b" }}>Total alertas</div>
          </div>
        </div>
        <div className="bg-white border border-[#e5e5e5] rounded-lg p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
            <Clock size={18} className="text-red-500" />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#000" }}>{stats.pendientes}</div>
            <div style={{ fontSize: 11, color: "#6b6b6b" }}>Pendientes</div>
          </div>
        </div>
        <div className="bg-white border border-[#e5e5e5] rounded-lg p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
            <CheckCircle size={18} className="text-green-600" />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#000" }}>{stats.resueltas}</div>
            <div style={{ fontSize: 11, color: "#6b6b6b" }}>Resueltas</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-lg">
        <div className="px-5 py-4 border-b border-[#ececec] flex items-center justify-between gap-4">
          <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>
            Alertas{" "}
            <span style={{ color: "#6b6b6b", fontWeight: 400 }}>· {data.length}</span>
          </div>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Buscar por zona, cámara, estado…"
          />
        </div>

        {loading ? (
          <div className="px-4 py-16 text-center" style={{ fontSize: 13, color: "#6b6b6b" }}>
            Cargando reporte…
          </div>
        ) : error ? (
          <div className="px-4 py-16 flex flex-col items-center gap-2 text-center">
            <FileWarning className="h-8 w-8 text-red-500" />
            <div style={{ fontSize: 13, color: "#dc2626" }}>{error}</div>
          </div>
        ) : (
          <CustomTable
            columns={columns}
            data={data}
            keyExtractor={(a) => a.id_alerta}
            emptyMessage={
              totalSinFiltrar === 0
                ? "Aún no se han registrado alertas en el sistema."
                : "Ninguna alerta coincide con tu búsqueda."
            }
          />
        )}
      </div>

      {/* Modal resolver alerta */}
      {alertaResolviendo && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={cerrarModalResolucion}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Resolver alerta</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Cámara: {alertaResolviendo.codigo_camara} · Zona: {alertaResolviendo.nombre_zona}
                </p>
              </div>
              <button
                onClick={cerrarModalResolucion}
                className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {alertaResolviendo.captura_frame && (
              <img
                src={alertaResolviendo.captura_frame}
                alt="Captura de la incidencia"
                className="w-full h-40 object-cover rounded-lg mb-4 border border-[#e5e5e5]"
              />
            )}

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Comentario / justificación *
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Describe qué ocurrió y cómo se resolvió la incidencia…"
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-[#d4d4d4] focus:border-[#8b5cf6] focus:outline-none resize-none text-sm"
              />
              {resolviendoError && (
                <p className="text-xs text-red-600 mt-1">{resolviendoError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={cerrarModalResolucion}
                className="h-10 px-4 rounded-lg border border-[#d4d4d4] text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={resolverAlerta}
                disabled={resolviendoLoading || !comentario.trim()}
                className="h-10 px-4 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white text-sm font-semibold disabled:opacity-50 shadow-lg shadow-purple-500/30 transition-all"
              >
                {resolviendoLoading ? "Guardando…" : "Marcar como resuelta"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal imagen expandida */}
      {imagenExpandida && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setImagenExpandida(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <button
              onClick={() => setImagenExpandida(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-1 text-sm"
            >
              <X size={16} /> Cerrar
            </button>
            <img
              src={imagenExpandida}
              alt="Captura de incidencia"
              className="w-full rounded-lg shadow-2xl"
            />
            <div className="mt-3 text-center">
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = imagenExpandida;
                  link.download = "captura-incidencia.jpg";
                  link.click();
                }}
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Descargar imagen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};