import { Camera, Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DeteccionOverlay } from "./DeteccionOverlay";
import { useVideoStream } from "../hooks/useVideoStream";

interface VideoStreamProps {
  camaraId: number;
  label?: string;
  source?: "rtsp" | "view";
  className?: string;
  height?: string;
  readonly?: boolean;
  mostrarDeteccion?: boolean;
}

export const VideoStream = ({
  camaraId,
  label,
  source = "rtsp",
  className = "",
  height = "h-48",
  readonly = false,
  mostrarDeteccion = true,
}: VideoStreamProps) => {
  const { currentFrame, status } = useVideoStream({ camaraId, source, readonly });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!currentFrame || !imgRef.current) return;
    imgRef.current.src = currentFrame;
  }, [currentFrame]);

  const statusIndicator = {
    connecting: { color: "bg-yellow-500", label: "Conectando..." },
    connected: { color: "bg-green-500", label: "En vivo" },
    disconnected: { color: "bg-red-500", label: "Desconectado" },
    error: { color: "bg-red-600", label: "Error" },
  }[status] ?? { color: "bg-yellow-500", label: "Conectando..." };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      {status === "connected" && currentFrame ? (
        <div className={`relative w-full ${height} flex items-center justify-center overflow-hidden bg-black`}>
          <img
            ref={imgRef}
            alt={label || `Cámara ${camaraId}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "auto",
            }}
          />
          {mostrarDeteccion && (
            <DeteccionOverlay camaraId={camaraId} activo={status === "connected"} />
          )}
        </div>
      ) : (
        <div className={`w-full ${height} flex flex-col items-center justify-center bg-gray-900 text-gray-400 gap-2`}>
          <Camera size={32} className="animate-pulse" />
          <span className="text-xs">
            {status === "connecting" ? "Conectando..." : "Sin señal"}
          </span>
        </div>
      )}

      <div className="absolute top-2 left-2 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${statusIndicator.color} ${status === "connected" ? "animate-pulse" : ""}`} />
        <span className="text-white text-[11px] font-medium bg-black/60 px-2 py-0.5 rounded">
          {label || `CAM-${String(camaraId).padStart(2, "0")}`}
        </span>
        {status === "connected" && <Wifi size={12} className="text-green-300" />}
      </div>

      <div className="absolute bottom-2 right-2">
        <span className="text-white text-[10px] bg-black/50 px-1.5 py-0.5 rounded">
          {statusIndicator.label}
        </span>
      </div>
    </div>
  );
};