import {
  Activity,
  AlertTriangle,
  Camera,
  ShieldCheck,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DashboardCharts } from "../../components/DashboardCharts";
import { VideoStream } from "../../components/VideoStream";
import { useStreamContext } from "../../context/StreamContext";
import type { Camara } from "../../models/camara.model";
import { capturarIncidencia } from "../../services/alerta.service";
import { camaraService } from "../../services/camara.service";
import type { RootState } from "../../store";

export const DashboardView = () => {
  const [camaras, setCamaras] = useState<Camara[]>([]);
  const [loading, setLoading] = useState(true);
  const [camaraExpandida, setCamaraExpandida] = useState<Camara | null>(null);
  const [alertasHoy, setAlertasHoy] = useState(0);
  const [alertasPendientes, setAlertasPendientes] = useState(0);
  const { frames } = useStreamContext();
  const [capturandoIncidencia, setCapturandoIncidencia] = useState(false);
  const [mensajeCaptura, setMensajeCaptura] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const capturarIncidenciaDashboard = async (camaraId: number) => {
    const frame = frames[camaraId];
    if (!frame) {
      setMensajeCaptura("❌ Sin imagen disponible");
      setTimeout(() => setMensajeCaptura(null), 3000);
      return;
    }
    setCapturandoIncidencia(true);
    try {
      await capturarIncidencia({
        id_camara: camaraId,
        frame_base64: frame,
        descripcion: "Incidencia reportada desde el Dashboard",
      });
      setMensajeCaptura("✅ Incidencia registrada");
      cargarAlertas();
    } catch {
      setMensajeCaptura("❌ Error al registrar");
    } finally {
      setCapturandoIncidencia(false);
      setTimeout(() => setMensajeCaptura(null), 3000);
    }
  };

  const cargarAlertas = () => {
    fetch("/alertas/stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("epp_token") || ""}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setAlertasHoy(data.alertas_hoy ?? 0);
        setAlertasPendientes(data.pendientes ?? 0);
      })
      .catch(() => {});
  };

  useEffect(() => {
    camaraService
      .getAll()
      .then((data) => { setCamaras(data); setLoading(false); })
      .catch(() => setLoading(false));
    cargarAlertas();
  }, []);

  const camarasOnline = camaras.filter((c) => c.estado_conexion === "activo").length;

  return (
    <div>
      <div className="mb-6">
        <div style={{ fontSize: 24, fontWeight: 700, color: "#000", letterSpacing: "-0.01em" }}>
          Dashboard
        </div>
        <div className="mt-1" style={{ fontSize: 13, color: "#6b6b6b" }}>
          Monitoreo en vivo de todas las zonas del sistema
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
              Cámaras Online
            </span>
            <div className="h-8 w-8 rounded-md bg-green-50 flex items-center justify-center">
              <Camera size={16} className="text-green-600" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#000", fontVariantNumeric: "tabular-nums" }}>
            {camarasOnline}
          </div>
          <div className="mt-1" style={{ fontSize: 12, color: "#6b6b6b" }}>
            de <span className="font-medium">{camaras.length}</span> totales
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
              Alertas Hoy
            </span>
            <div className="h-8 w-8 rounded-md bg-red-50 flex items-center justify-center">
              <AlertTriangle size={16} className="text-red-600" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#000", fontVariantNumeric: "tabular-nums" }}>
            {alertasHoy}
          </div>
          <div className="mt-1" style={{ fontSize: 12, color: alertasPendientes > 0 ? "#dc2626" : "#10b981" }}>
            {alertasPendientes > 0
              ? `⚠ ${alertasPendientes} pendiente${alertasPendientes !== 1 ? "s" : ""}`
              : "✓ Sin infracciones"}
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
              Zonas
            </span>
            <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center">
              <Activity size={16} className="text-blue-600" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#000", fontVariantNumeric: "tabular-nums" }}>
            {new Set(camaras.map((c) => c.id_zona)).size}
          </div>
          <div className="mt-1" style={{ fontSize: 12, color: "#6b6b6b" }}>zonas activas</div>
        </div>

        <div className="bg-white border border-[#e5e5e5] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 11, color: "#6b6b6b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
              Sistema
            </span>
            <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center">
              <ShieldCheck size={16} className="text-blue-600" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#000", fontVariantNumeric: "tabular-nums" }}>
            Operativo
          </div>
          <div className="mt-1" style={{ fontSize: 12, color: "#6b6b6b" }}>100% disponibilidad</div>
        </div>
      </div>

      {/* Grid de Cámaras */}
      <div className="mb-4 flex items-center justify-between">
        <div style={{ fontSize: 17, fontWeight: 600, color: "#000" }}>Transmisión en Vivo</div>
        <span style={{ fontSize: 12, color: "#6b6b6b" }}>
          {camarasOnline} cámara{camarasOnline !== 1 ? "s" : ""} activa{camarasOnline !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <span className="animate-pulse">Cargando cámaras...</span>
        </div>
      ) : camaras.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-[#6b6b6b] gap-2">
          <Camera size={48} />
          <span>No hay cámaras configuradas</span>
          <a href="/admin/camaras" style={{ color: "#3b82f6", fontSize: 13 }} className="hover:underline">
            Configurar cámaras
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {camaras.map((cam) => (
            <div
              key={cam.id_camara}
              className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => setCamaraExpandida(cam)}
            >
              <div className="relative">
                <VideoStream
                  camaraId={cam.id_camara}
                  label={cam.codigo_camara}
                  height="h-44"
                  source={cam.tipo_fuente === "fallback_phone" ? "view" : "rtsp"}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-2">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-[#ececec]">
                <div className="flex items-center justify-between">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#000" }}>{cam.codigo_camara}</div>
                    <div style={{ fontSize: 12, color: "#6b6b6b" }}>{cam.zona_nombre || "Sin zona"}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {cam.estado_conexion === "activo" ? (
                      <>
                        <Wifi size={14} className="text-green-500" />
                        <span style={{ fontSize: 11, color: "#059669" }} className="font-medium">Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff size={14} style={{ color: "#ccc" }} />
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>Offline</span>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#ccc" }} className="font-mono mt-1">
                  {cam.tipo_fuente === "fallback_phone" ? "📱 Cámara virtual" : (cam.ip_direccion ?? "")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gráficos por rol */}
      {user && (
        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <div style={{ fontSize: 17, fontWeight: 600, color: "#000" }}>Estadísticas</div>
            <span style={{ fontSize: 11, color: "#6b6b6b", background: "#f5f5f5", padding: "2px 8px", borderRadius: 99 }}>
              {user.rolLabel}
            </span>
          </div>
          <DashboardCharts rol={user.rol} />
        </div>
      )}

      {/* Modal de cámara expandida */}
      {camaraExpandida && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          onClick={() => setCamaraExpandida(null)}
        >
          <div
            className="flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur-sm shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="text-white font-semibold text-lg">{camaraExpandida.codigo_camara}</div>
              <div className="text-zinc-400 text-sm">{camaraExpandida.zona_nombre || "Sin zona"}</div>
            </div>
            <button
              onClick={() => setCamaraExpandida(null)}
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          <div
            className="flex-1 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-4xl">
              <VideoStream
                camaraId={camaraExpandida.id_camara}
                label={camaraExpandida.codigo_camara}
                height="h-[60vh]"
                source={camaraExpandida.tipo_fuente === "fallback_phone" ? "view" : "rtsp"}
                readonly={true}
              />
            </div>
          </div>

          <div
            className="px-6 py-3 bg-black/60 backdrop-blur-sm shrink-0 flex items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              {camaraExpandida.estado_conexion === "activo" ? (
                <Wifi size={14} className="text-green-500" />
              ) : (
                <WifiOff size={14} className="text-zinc-600" />
              )}
              <span className="text-zinc-400 text-xs">
                {camaraExpandida.estado_conexion === "activo" ? "Online" : "Offline"}
              </span>
            </div>
            {camaraExpandida.ip_direccion && (
              <span className="text-zinc-600 text-xs font-mono">{camaraExpandida.ip_direccion}</span>
            )}
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => capturarIncidenciaDashboard(camaraExpandida.id_camara)}
                disabled={capturandoIncidencia}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/90 hover:bg-yellow-500 disabled:bg-gray-600 text-white text-xs font-semibold transition-colors shadow"
              >
                {capturandoIncidencia ? "Capturando..." : "🚨 Reportar incidencia"}
              </button>
              {mensajeCaptura && (
                <span className={`text-xs font-medium ${mensajeCaptura.includes("✅") ? "text-green-400" : "text-red-400"}`}>
                  {mensajeCaptura}
                </span>
              )}
              <span className="text-zinc-600 text-xs">Haz clic fuera para cerrar</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};