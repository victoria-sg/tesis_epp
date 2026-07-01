import { Camera, Smartphone, Wifi, WifiOff } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PhoneCameraFeed } from "../components/PhoneCameraFeed";
import { TOKEN_KEY } from "../constants/authStorageConstants";

export const PhoneCameraView = () => {
  const { camaraId } = useParams<{ camaraId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [streamActive, setStreamActive] = useState(false);
  const tokenProcessed = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const numericId = useMemo(() => (camaraId ? Number(camaraId) : NaN), [camaraId]);

  useEffect(() => {
    if (tokenProcessed.current) return;
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      tokenProcessed.current = true;
      localStorage.setItem(TOKEN_KEY, tokenFromUrl);
      window.location.href = `/phone-camera/${camaraId}`;
      return;
    }
    setIsReady(true);
  }, [searchParams, camaraId]);

  const token = localStorage.getItem(TOKEN_KEY);
  const isAuthenticated = !!token;

  const handleStreamChange = useCallback((active: boolean) => {
    setStreamActive(active);
  }, []);

  if (!isReady && searchParams.get("token")) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <span className="text-white text-sm animate-pulse">Autenticando...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden">

      {/* Header compacto */}
      <div className="bg-zinc-900/80 backdrop-blur-sm px-4 py-2 flex items-center justify-between shrink-0 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Camera size={14} className="text-white" />
          </div>
          <div>
            <div className="text-white text-xs font-semibold">EPP Monitor</div>
            <div className="text-zinc-500 text-[9px] uppercase tracking-wider">
              Cámara #{camaraId}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {streamActive ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 text-[10px] font-medium">EN VIVO</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span className="text-zinc-500 text-[10px] font-medium">DETENIDO</span>
            </>
          )}
        </div>
      </div>

      {/* Stream area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {!isAuthenticated ? (
          <div className="text-center px-6">
            <Smartphone size={48} className="mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-400 text-sm mb-2">
              Usa tu teléfono como cámara de seguridad
            </p>
            <p className="text-zinc-600 text-xs mb-6">
              Escanea el código QR desde el panel de administración para
              vincular esta cámara automáticamente.
            </p>
            <button
              onClick={() => navigate(`/login`)}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/30"
            >
              Iniciar sesión
            </button>
          </div>
        ) : (
          <div className="w-full h-full">
            {!isNaN(numericId) ? (
              <PhoneCameraFeed
                deviceId={`phone_${numericId}`}
                camaraId={numericId}
                label={`Cámara ${numericId}`}
                className="w-full h-full rounded-none"
                onStreamChange={handleStreamChange}
              />
            ) : (
              <div className="text-zinc-500 text-sm flex items-center justify-center h-full">
                ID de cámara inválido
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer compacto */}
      <div className="bg-zinc-900/80 backdrop-blur-sm px-4 py-2 flex items-center justify-between shrink-0 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          {streamActive ? (
            <Wifi size={12} className="text-green-500" />
          ) : (
            <WifiOff size={12} className="text-zinc-600" />
          )}
          <span className="text-zinc-500 text-[10px]">
            {streamActive ? "Transmitiendo" : "Sin transmisión"}
          </span>
        </div>
      </div>

    </div>
  );
};