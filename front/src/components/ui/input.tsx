import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = ({ error, className = "", ...props }: InputProps) => (
  <input
    {...props}
    className={`h-12 w-full rounded-md border-[1.5px] border-[#d4d4d4] bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-red-500" : ""} ${className}`}
  />
);
