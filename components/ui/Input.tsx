import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#2a2118]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`rounded-md border bg-white px-3 py-2 text-sm text-[#2a2118] outline-none transition-colors placeholder:text-[#2a2118]/35 focus:border-[#b3402a] ${
          error ? "border-red-600" : "border-[#2a2118]/20"
        } ${className}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
});
