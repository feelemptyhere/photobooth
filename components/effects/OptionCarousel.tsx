"use client";

import type { ReactNode } from "react";
import { CircleThumbButton } from "@/components/ui/CircleThumbButton";

interface ThumbDescriptor {
  thumbnailUrl: string;
  label?: string;
  filterCss?: string;
}

interface OptionCarouselProps<T> {
  options: T[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Map an option to its thumbnail descriptor. */
  renderThumb: (opt: T) => ThumbDescriptor;
  /** Section label, e.g. "FILTER". */
  sectionLabel?: string;
  /** Render key for each option (defaults to its id). */
  getId?: (opt: T) => string;
}

/**
 * Generic horizontal-scroll row of <CircleThumbButton />. The three named
 * carousels (Filter/Background/Effect) are thin wrappers over this, keeping the
 * rendering data-driven and DRY.
 */
export function OptionCarousel<T>({
  options,
  selectedId,
  onSelect,
  renderThumb,
  sectionLabel,
  getId,
}: OptionCarouselProps<T> & { children?: ReactNode }) {
  return (
    <div className="w-full">
      {sectionLabel && (
        <p className="editorial-wide mb-2 text-[9px] text-[var(--muted)]">
          {sectionLabel}
        </p>
      )}
      <div className="flex w-full gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {options.map((opt, i) => {
          const id = getId ? getId(opt) : String((opt as { id?: unknown }).id ?? i);
          const desc = renderThumb(opt);
          return (
            <CircleThumbButton
              key={id}
              thumbnailUrl={desc.thumbnailUrl}
              label={desc.label}
              filterCss={desc.filterCss}
              selected={selectedId === id}
              onClick={() => onSelect(id)}
            />
          );
        })}
      </div>
    </div>
  );
}
