import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  touched?: boolean;
}

export const CustomInput = ({
  label,
  error,
  touched,
  className = "",
  ...props
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
      <input
        {...props}
        className={`h-12 w-full rounded-md border-[1.5px] bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
          hasError ? "border-red-500" : "border-[#d4d4d4]"
        } ${className}`}
      />
      {hasError && <div className="mt-1 text-[12px] text-red-600">{error}</div>}
    </div>
  );
};
