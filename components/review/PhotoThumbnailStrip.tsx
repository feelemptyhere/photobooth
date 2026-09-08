"use client";

import type { CapturedPhoto } from "@/types";
import { getFilterCss } from "@/lib/assets/filters";

interface PhotoThumbnailStripProps {
  photos: CapturedPhoto[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

/**
 * Horizontal scroll of the 6 captured photos. The active one gets a solid
 * border + slight scale. Each thumb shows its current filter live.
 */
export function PhotoThumbnailStrip({
  photos,
  activeIndex,
  onSelect,
}: PhotoThumbnailStripProps) {
  return (
    <div className="flex w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {photos.map((p, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={active}
            className={[
              "relative h-16 w-12 shrink-0 overflow-hidden rounded-md border bg-paper transition-all",
              active ? "border-ink scale-105" : "border-ink/15",
            ].join(" ")}
          >
            <img
              src={p.imageDataUrl}
              alt={`photo ${i + 1}`}
              className="h-full w-full object-cover"
              style={{ filter: getFilterCss(p.filterId) }}
            />
          </button>
        );
      })}
    </div>
  );
}
