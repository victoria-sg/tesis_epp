import { X } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export const CustomModal = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: Props) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ececec] shrink-0">
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#000",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-[#f5f5f5] transition-colors text-[#6b6b6b]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
};
