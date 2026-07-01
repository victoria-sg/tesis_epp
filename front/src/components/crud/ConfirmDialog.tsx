import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  loading,
}: Props) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#000",
            }}
          >
            {title}
          </div>
          <div className="mt-1" style={{ fontSize: 13, color: "#6b6b6b" }}>
            {message}
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-10 px-4 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white hover:from-[#dc2626] hover:to-[#b91c1c] text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? "Eliminando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
