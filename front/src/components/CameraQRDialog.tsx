import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CustomModal } from "./crud/CustomModal";

interface CameraQRDialogProps {
  open: boolean;
  onClose: () => void;
  camaraId: number;
  codigoCamara: string;
}

export const CameraQRDialog = ({
  open,
  onClose,
  camaraId,
  codigoCamara,
}: CameraQRDialogProps) => {
  const [copied, setCopied] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/system/public-url")
      .then((res) => res.json())
      .then((data) => setPublicUrl(data.public_url))
      .catch(() => setPublicUrl(window.location.origin));
  }, [open]);

  const qrUrl = useMemo(() => {
    const token = localStorage.getItem("epp_token") || "";
    const origin = publicUrl || window.location.origin;
    return `${origin}/phone-camera/${camaraId}?token=${token}`;
  }, [camaraId, publicUrl]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(qrUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [qrUrl]);

  return (
    <CustomModal open={open} onClose={onClose} title="Vincular teléfono">
      <div className="flex flex-col items-center gap-5 py-2">
        <p className="text-[13px] text-zinc-500 text-center max-w-xs">
          Escanea este código QR con el teléfono que quieras usar como cámara.
          La cámara se vinculará automáticamente como{" "}
          <strong className="text-zinc-800">{codigoCamara}</strong>.
        </p>

        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
          <QRCodeSVG value={qrUrl} size={200} level="M" includeMargin />
        </div>

        <div className="w-full max-w-xs">
          <label className="block text-[11px] text-zinc-400 mb-1 font-medium uppercase tracking-wider">
            O comparte este enlace
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={qrUrl}
              className="flex-1 h-9 px-3 rounded-md bg-zinc-50 border border-zinc-200 text-[12px] text-zinc-600 font-mono truncate outline-none"
            />
            <button
              onClick={handleCopy}
              className="h-9 px-3 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-semibold transition-colors"
            >
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>

        <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 text-[12px] text-blue-800 leading-relaxed">
          <strong>💡 Instrucciones:</strong>
          <ol className="mt-1.5 ml-4 list-decimal space-y-1">
            <li>Abre la cámara del teléfono y escanea el código QR</li>
            <li>
              Si el QR no abre automáticamente, copia el enlace y pégalo en el
              navegador
            </li>
            <li>
              Presiona <strong>"📷 Iniciar"</strong> para comenzar la
              transmisión
            </li>
          </ol>
        </div>
      </div>
    </CustomModal>
  );
};