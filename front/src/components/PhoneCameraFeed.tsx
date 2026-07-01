import { useCallback, useEffect, useRef, useState } from "react";
import { capturarIncidencia } from "../services/alerta.service";

interface PhoneCameraFeedProps {
  deviceId: string;
  camaraId?: number;
  label?: string;
  className?: string;
  onStreamChange?: (active: boolean) => void;
}

export const PhoneCameraFeed = ({
  deviceId,
  camaraId,
  label = "Teléfono",
  className = "",
  onStreamChange,
}: PhoneCameraFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isActiveRef = useRef(false);
  const [isActive, setIsActive] = useState(false);
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [capturando, setCapturando] = useState(false);
  const [capturaExito, setCapturaExito] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const connectWs = useCallback(() => {
    const token = localStorage.getItem("epp_token") || "";
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    let url = `${protocol}//${window.location.host}/stream/fallback/${deviceId}?token=${token}`;
    if (camaraId !== undefined) url += `&camara_id=${camaraId}`;
    const ws = new WebSocket(url);
    ws.onopen = () => setWsStatus("connected");
    ws.onclose = () => {
      setWsStatus("disconnected");
      wsRef.current = null;
      if (isActiveRef.current) {
        setTimeout(() => {
          if (isActiveRef.current && wsRef.current === null) {
            const newWs = connectWs();
            wsRef.current = newWs;
          }
        }, 2000);
      }
    };
    ws.onerror = () => {
      setError("Error de conexión con el servidor");
      ws.close();
    };
    wsRef.current = ws;
    return ws;
  }, [deviceId, camaraId]);

  const capturarFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !ctxRef.current) return;
    if (camaraId === undefined) return;

    setCapturando(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame_base64 = canvas.toDataURL("image/jpeg", 0.9);

      await capturarIncidencia({
        id_camara: camaraId,
        frame_base64,
        descripcion: "Incidencia capturada manualmente desde teléfono",
      });

      setCapturaExito(true);
      setTimeout(() => setCapturaExito(false), 3000);
    } catch {
      setError("No se pudo guardar la captura. Intenta de nuevo.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setCapturando(false);
    }
  }, [camaraId]);

  const startStreaming = useCallback(async () => {
    setError(null);
    setWsStatus("connecting");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Este navegador no soporta acceso a cámara.");
      }

      const isLandscape = window.innerWidth > window.innerHeight;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: isLandscape ? 1280 : 720 },
          height: { ideal: isLandscape ? 720 : 1280 },
          facingMode: "environment",
        },
        audio: false,
      });

      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;

      const ws = connectWs();
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Timeout")), 5000);
        ws.onopen = () => { clearTimeout(timeout); setWsStatus("connected"); resolve(); };
        ws.onerror = () => { clearTimeout(timeout); reject(new Error("No se pudo conectar")); };
      });

      const video = videoRef.current!;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvasRef.current = canvas;
      ctxRef.current = ctx;

      let enviando = false;

      const captureFrame = () => {
        const currentWs = wsRef.current;
        if (!currentWs || currentWs.readyState !== WebSocket.OPEN) return;
        if (enviando) return;

        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 480;
        canvas.width = Math.round(vw / 2);
        canvas.height = Math.round(vh / 2);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        enviando = true;
        canvas.toBlob(
          (blob) => {
            if (blob && wsRef.current?.readyState === WebSocket.OPEN) {
              const reader = new FileReader();
              reader.onload = () => {
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                  wsRef.current.send(reader.result as string);
                }
                enviando = false;
              };
              reader.readAsDataURL(blob);
            } else {
              enviando = false;
            }
          },
          "image/jpeg",
          0.5,
        );
      };

      captureTimerRef.current = setInterval(captureFrame, 150);
      isActiveRef.current = true;
      setIsActive(true);
      onStreamChange?.(true);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
      setWsStatus("disconnected");
    }
  }, [connectWs, onStreamChange]);

  const stopStreaming = useCallback(() => {
    isActiveRef.current = false;
    if (captureTimerRef.current) { clearInterval(captureTimerRef.current); captureTimerRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (wsRef.current) { wsRef.current.close(1000); wsRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    canvasRef.current = null;
    ctxRef.current = null;
    setIsActive(false);
    setWsStatus("disconnected");
    setError(null);
    onStreamChange?.(false);
  }, [onStreamChange]);

  useEffect(() => {
    return () => {
      if (isActiveRef.current) stopStreaming();
    };
  }, [stopStreaming]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-black overflow-hidden ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Overlay sin stream */}
      {!isActive && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 text-gray-400 gap-6 px-6 pb-24">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
            <span className="text-3xl">📷</span>
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-semibold mb-1">Cámara lista para transmitir</p>
            <p className="text-gray-500 text-xs">Presiona el botón de abajo para iniciar</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-x-4 top-16 text-white text-sm px-4 py-3 rounded-lg bg-red-600/90 leading-relaxed">
          ⚠️ {error}
        </div>
      )}

      {/* Notificación de captura exitosa */}
      {capturaExito && (
        <div className="absolute inset-x-4 top-16 text-white text-sm px-4 py-3 rounded-lg bg-green-600/90 leading-relaxed text-center">
          ✅ Incidencia registrada correctamente
        </div>
      )}

      {/* Indicador estado */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${
          wsStatus === "connected" && isActive ? "bg-green-500 animate-pulse"
          : wsStatus === "connecting" ? "bg-yellow-500"
          : "bg-gray-500"
        }`} />
        <span className="text-white text-[11px] font-medium bg-black/50 px-2 py-0.5 rounded">
          {label}
        </span>
      </div>

      {/* Botones */}
      <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-5">
        {isActive ? (
          <>
            <button
              onClick={capturarFrame}
              disabled={capturando || camaraId === undefined}
              className="w-12 h-12 rounded-full bg-yellow-500/90 disabled:bg-gray-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              title="Capturar incidencia"
            >
              {capturando
                ? <span className="text-[10px] font-bold">...</span>
                : <span className="text-xl">🚨</span>
              }
            </button>
            <button
              onClick={stopStreaming}
              className="w-10 h-10 rounded-full bg-red-600/70 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <span className="text-sm">⏹</span>
            </button>
          </>
        ) : (
          <button
            onClick={startStreaming}
            disabled={wsStatus === "connecting"}
            className="w-14 h-14 rounded-full bg-blue-600/90 disabled:bg-gray-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            {wsStatus === "connecting"
              ? <span className="text-[10px] font-bold">...</span>
              : <span className="text-2xl">📷</span>
            }
          </button>
        )}
      </div>

      {isActive && (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-8">
          <span className="text-[9px] text-yellow-400/70">Incidencia</span>
          <span className="text-[9px] text-red-400/70">Detener</span>
        </div>
      )}
    </div>
  );
};