import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#b3402a] text-[#faf6ef] hover:bg-[#9a3624] disabled:bg-[#b3402a]/50",
  secondary:
    "bg-transparent border border-[#2a2118]/25 text-[#2a2118] hover:bg-[#2a2118]/5",
  ghost: "bg-transparent text-[#2a2118] hover:bg-[#2a2118]/5",
  danger: "bg-transparent border border-red-700/40 text-red-800 hover:bg-red-700/10",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = "primary", className = "", ...props }, ref) {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        {...props}
      />
    );
  },
);
