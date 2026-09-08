"use client";

import type { BackgroundOption } from "@/types";
import { OptionCarousel } from "./OptionCarousel";

interface BackgroundCarouselProps {
  options: BackgroundOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Background picker — color swatches (image backgrounds supported via value). */
export function BackgroundCarousel({
  options,
  selectedId,
  onSelect,
}: BackgroundCarouselProps) {
  return (
    <OptionCarousel<BackgroundOption>
      options={options}
      selectedId={selectedId}
      onSelect={onSelect}
      sectionLabel="background"
      getId={(b) => b.id}
      renderThumb={(b) => ({ thumbnailUrl: b.thumbnailUrl, label: b.name })}
    />
  );
}
