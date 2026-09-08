"use client";

import { useEffect, useRef } from "react";
import type { StripPack } from "@/types";
import { renderPackPreview } from "@/lib/canvas/renderPackPreview";

interface PackThumbnailProps {
  pack: StripPack;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Mini strip preview rendered to <canvas> from pack data (Fase 4). Replaces
 * the Fase 1 div-based placeholder with a faithful miniature: background,
 * texture, slot placeholders, decorative elements, footer. Data-driven — no
 * per-pack logic here.
 */
export function PackThumbnail({ pack, selected, onSelect }: PackThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    renderPackPreview(canvas, pack, { maxWidth: 76 }).then(() => {
      if (cancelled) return;
    });
    return () => {
      cancelled = true;
    };
  }, [pack]);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`pack ${pack.name}`}
      className="group flex flex-col items-center gap-3 focus:outline-none"
    >
      <div
        className="overflow-hidden rounded-md transition-transform duration-200"
        style={{
          transform: selected ? "translateY(-4px)" : "translateY(0)",
          boxShadow: selected
            ? "0 0 0 1.5px var(--ink)"
            : "0 0 0 1px var(--line)",
        }}
      >
        <canvas ref={canvasRef} className="block" />
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

