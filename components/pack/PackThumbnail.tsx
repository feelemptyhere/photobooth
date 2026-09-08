"use client";

import type { StripPack } from "@/types";

interface PackThumbnailProps {
  pack: StripPack;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Mini strip preview rendered as a styled <div> (docs/06-TEMPLATE-SYSTEM.md
 * explicitly permits div-based preview in Fase 1; real canvas render lands in
 * Fase 4). Shows pack background tint + 6 slot placeholders + footer brand.
 */
export function PackThumbnail({ pack, selected, onSelect }: PackThumbnailProps) {
  const slotH = 22;
  const gap = 5;
  const slots = 6;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group flex flex-col items-center gap-3 focus:outline-none"
    >
      <div
        className="w-[72px] overflow-hidden rounded-md px-2 pb-2 pt-2 transition-transform duration-200"
        style={{
          background: pack.background,
          transform: selected ? "translateY(-4px)" : "translateY(0)",
          boxShadow: selected
            ? "0 0 0 1.5px var(--ink)"
            : "0 0 0 1px var(--line)",
        }}
      >
        <div className="flex flex-col" style={{ gap }}>
          {Array.from({ length: slots }).map((_, i) => (
            <div
              key={i}
              className="w-full rounded-sm"
              style={{
                height: slotH,
                background: "rgba(10,10,10,0.12)",
              }}
            />
          ))}
        </div>
        <div
          className="editorial mt-2 truncate text-center text-[7px]"
          style={{ color: pack.typography.footerColor }}
        >
          {pack.footer.brandText}
        </div>
      </div>
      <span
        className={`editorial text-[10px] transition-colors ${
          selected ? "text-ink" : "text-[var(--muted)]"
        }`}
      >
        {pack.name}
      </span>
    </button>
  );
}
