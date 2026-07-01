import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Buscar…",
}: Props) => (
  <div className="relative w-72 max-w-full">
    <Search
      size={14}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
    />
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-9 pl-9 pr-3 rounded-md bg-[#f5f5f5] focus:bg-white border border-transparent focus:border-[#3b82f6] outline-none transition-colors"
      style={{ fontSize: 13 }}
    />
  </div>
);
