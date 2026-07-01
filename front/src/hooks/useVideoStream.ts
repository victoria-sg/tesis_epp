import { useEffect } from "react";
import { useStreamContext } from "../context/StreamContext";

interface UseVideoStreamOptions {
  camaraId: number;
  source?: "rtsp" | "fallback" | "view";
  /** Si es true, solo lee el frame sin abrir/cerrar conexión */
  readonly?: boolean;
}

export const useVideoStream = ({
  camaraId,
  source = "rtsp",
  readonly = false,
}: UseVideoStreamOptions) => {
  const { frames, subscribeCamera, unsubscribeCamera } = useStreamContext();

  useEffect(() => {
    if (readonly) return;
    subscribeCamera(camaraId, source === "view" ? "view" : "rtsp");
    return () => {
      unsubscribeCamera(camaraId);
    };
  }, [camaraId, source, readonly, subscribeCamera, unsubscribeCamera]);

  const currentFrame = frames[camaraId] ?? null;

  return {
    currentFrame,
    status: currentFrame ? "connected" : "connecting",
  };
};