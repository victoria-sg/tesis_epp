import { useEffect, useRef, useState } from "react";
import { getUltimaDeteccion, type UltimaDeteccion } from "../services/deteccion.services";

interface DeteccionOverlayProps {
  camaraId: number;
  activo?: boolean;
}

const COLOR_INFRACCION = "#ef4444";
const COLOR_NORMAL = "#22c55e";

export const DeteccionOverlay = ({ camaraId, activo = true }: DeteccionOverlayProps) => {
  const [deteccion, setDeteccion] = useState<UltimaDeteccion | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!activo) return;

    const consultar = async () => {
      try {
        const data = await getUltimaDeteccion(camaraId);
        setDeteccion(data.disponible ? data : null);
      } catch {
        setDeteccion(null);
      }
    };

    consultar();
    intervalRef.current = setInterval(consultar, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [camaraId, activo]);

  if (!deteccion || !deteccion.detecciones || deteccion.detecciones.length === 0) {
    return null;
  }

  const anchoFrame = deteccion.ancho_frame || 640;
  const altoFrame = deteccion.alto_frame || 480;
  const esInfraccion = (clase: string) =>
    ["NO-Hardhat", "NO-Safety Vest", "NO-Mask"].includes(clase);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${anchoFrame} ${altoFrame}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {deteccion.detecciones.map((det, i) => {
        const [x1, y1, x2, y2] = det.bbox;
        const w = x2 - x1;
        const h = y2 - y1;
        const infraccion = esInfraccion(det.nombre_clase);
        const color = infraccion ? COLOR_INFRACCION : COLOR_NORMAL;

        return (
          <g key={i}>
            <rect
              x={x1}
              y={y1}
              width={w}
              height={h}
              fill="none"
              stroke={color}
              strokeWidth={3}
            />
            <rect
              x={x1}
              y={y1 - 18}
              width={Math.max(det.nombre_clase.length * 7 + 10, 50)}
              height={18}
              fill={color}
            />
            <text
              x={x1 + 4}
              y={y1 - 5}
              fill="#fff"
              fontSize={12}
              fontFamily="sans-serif"
              fontWeight="600"
            >
              {det.nombre_clase} {(det.confianza * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
};