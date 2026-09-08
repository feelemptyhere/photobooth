"use client";

import type { EffectOption } from "@/types";
import { OptionCarousel } from "./OptionCarousel";

interface EffectCarouselProps {
  options: EffectOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Face/body overlay picker — original placeholder SVGs. */
export function EffectCarousel({
  options,
  selectedId,
  onSelect,
}: EffectCarouselProps) {
  return (
    <OptionCarousel<EffectOption>
      options={options}
      selectedId={selectedId}
      onSelect={onSelect}
      sectionLabel="effect"
      getId={(e) => e.id}
      renderThumb={(e) => ({ thumbnailUrl: e.thumbnailUrl, label: e.name })}
    />
  );
}
