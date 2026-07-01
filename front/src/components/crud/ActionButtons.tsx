import { Pencil, Trash2 } from "lucide-react";

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
}

export const ActionButtons = ({
  onEdit,
  onDelete,
  editDisabled,
  deleteDisabled,
}: Props) => (
  <div className="flex items-center justify-center gap-1">
    {onEdit && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        disabled={editDisabled}
        className="h-8 w-8 rounded-md border border-[#d4d4d4] hover:border-[#3b82f6] hover:bg-blue-50 flex items-center justify-center disabled:opacity-30 transition-colors"
        title="Editar"
      >
        <Pencil size={13} className="text-[#6b6b6b] hover:text-[#3b82f6]" />
      </button>
    )}
    {onDelete && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        disabled={deleteDisabled}
        className="h-8 w-8 rounded-md border border-[#d4d4d4] hover:border-[#ef4444] hover:bg-red-50 flex items-center justify-center disabled:opacity-30 transition-colors"
        title="Eliminar"
      >
        <Trash2 size={13} className="text-[#6b6b6b] hover:text-[#ef4444]" />
      </button>
    )}
  </div>
);
