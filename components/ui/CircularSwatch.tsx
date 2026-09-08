"use client";

interface CircularSwatchProps {
  color: string;
  selected: boolean;
  onClick: () => void;
  size?: number;
  label?: string;
}

/**
 * Round theme swatch — selected state shows a thin ring + slight scale
 * (Framer Motion spring handled by parent if needed; here pure CSS transition).
 */
export function CircularSwatch({
  color,
  selected,
  onClick,
  size = 64,
  label,
}: CircularSwatchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label ?? "theme swatch"}
      className="group relative flex items-center justify-center rounded-full transition-transform duration-200"
      style={{ width: size, height: size }}
    >
      <span
        className="block rounded-full transition-all duration-200"
        style={{
          width: size,
          height: size,
          background: color,
          transform: selected ? "scale(1.05)" : "scale(1)",
          boxShadow: selected ? "inset 0 0 0 1.5px #0a0a0a" : "none",
        }}
      />
    </button>
  );
}
