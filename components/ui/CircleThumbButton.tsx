"use client";

import { motion } from "framer-motion";

interface CircleThumbButtonProps {
  thumbnailUrl: string;
  label?: string;
  selected: boolean;
  onClick: () => void;
  /**
   * Optional CSS filter string applied to the thumbnail. Added so the
   * <FilterCarousel /> can preview CSS-based filters live on a sample image
   * (docs/06 §4 — FilterDef has no thumbnailUrl of its own). Background and
   * effect carousels leave this undefined.
   */
  filterCss?: string;
}

/**
 * Round thumbnail selector used by every carousel (docs/05 §CircleThumbButton).
 */
export function CircleThumbButton({
  thumbnailUrl,
  label,
  selected,
  onClick,
  filterCss,
}: CircleThumbButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 cursor-pointer flex-col items-center gap-1.5"
      aria-pressed={selected}
    >
      <motion.span
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={[
          "block h-14 w-14 overflow-hidden rounded-full border bg-paper",
          selected ? "border-ink ring-2 ring-ink/15" : "border-ink/15",
        ].join(" ")}
      >
        <span
          className="block h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${thumbnailUrl})`,
            filter: filterCss || undefined,
          }}
        />
      </motion.span>
      {label && (
        <span className="editorial-wide text-[8px] text-[var(--muted)]">
          {label}
        </span>
      )}
    </button>
  );
}
