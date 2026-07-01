import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const CustomPagination = ({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: Props) => {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-[#ececec]">
      <div
        style={{
          fontSize: 12,
          color: "#6b6b6b",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {start}–{end} de {total}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8 rounded-md border border-[#d4d4d4] flex items-center justify-center disabled:opacity-30 hover:bg-[#f5f5f5] transition-colors"
        >
          <ChevronLeft size={14} />
        </button>

        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 7) {
            pageNum = i + 1;
          } else if (page <= 4) {
            pageNum = i + 1;
          } else if (page >= totalPages - 3) {
            pageNum = totalPages - 6 + i;
          } else {
            pageNum = page - 3 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`h-8 min-w-8 rounded-md flex items-center justify-center text-sm transition-all ${
                page === pageNum
                  ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white shadow-md shadow-blue-500/20"
                  : "border border-[#d4d4d4] text-[#1a1a1a] hover:bg-[#f5f5f5]"
              }`}
              style={{ fontSize: 12, fontWeight: page === pageNum ? 600 : 400 }}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-8 w-8 rounded-md border border-[#d4d4d4] flex items-center justify-center disabled:opacity-30 hover:bg-[#f5f5f5] transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
