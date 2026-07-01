import { ChevronDown } from "lucide-react";

interface Option {
  value: string | number;
  label: string;
}

interface Props {
  label?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  className?: string;
}

export const CustomSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Seleccionar…",
  error,
  touched,
  disabled,
  className = "",
}: Props) => {
  const hasError = touched && error;

  return (
    <div>
      {label && (
        <label
          className="block mb-1.5"
          style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`h-12 w-full appearance-none rounded-md border-[1.5px] bg-white px-3 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
            hasError ? "border-red-500" : "border-[#d4d4d4]"
          } ${className}`}
          style={{
            color: value === undefined || value === "" ? "#a0aec0" : "#1a202c",
          }}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b6b6b]"
        />
      </div>
      {hasError && <div className="mt-1 text-[12px] text-red-600">{error}</div>}
    </div>
  );
};
