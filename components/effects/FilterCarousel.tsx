"use client";

import type { FilterDef } from "@/types";
import { OptionCarousel } from "./OptionCarousel";
import { FILTER_SAMPLE_THUMB } from "@/lib/assets/filters";

interface FilterCarouselProps {
  options: FilterDef[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** CSS-filter picker — previews each filter live on the shared sample face. */
export function FilterCarousel({
  options,
  selectedId,
  onSelect,
}: FilterCarouselProps) {
  return (
    <OptionCarousel<FilterDef>
      options={options}
      selectedId={selectedId}
      onSelect={onSelect}
      sectionLabel="filter"
      getId={(f) => f.id}
      renderThumb={(f) => ({
        thumbnailUrl: FILTER_SAMPLE_THUMB,
        label: f.name,
        filterCss: f.cssFilter,
      })}
    />
  );
}
