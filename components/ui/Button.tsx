"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "ghost" | "gradient";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base =
  "editorial inline-flex items-center justify-center gap-2 transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  // Solid dark on paper — PRD §4 minimal contrast
  primary:
    "bg-ink text-paper rounded-full px-8 py-3 text-xs tracking-editorial hover:bg-ink/90 disabled:bg-ink/40 disabled:text-paper/70",
  ghost:
    "bg-transparent text-ink/70 hover:text-ink px-3 py-2 text-xs tracking-editorial",
  // Instagram-like yellow→pink→purple (original gradient, not a trademark)
  gradient:
    "text-white rounded-full px-8 py-3 text-xs tracking-editorial shadow-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...rest }, ref) => {
    const gradientStyle =
      variant === "gradient"
        ? {
            backgroundImage:
              "linear-gradient(135deg, #FCAF45 0%, #E1306C 45%, #833AB4 100%)",
          }
        : undefined;
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        style={gradientStyle}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
