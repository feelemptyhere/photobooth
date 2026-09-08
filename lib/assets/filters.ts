import type { FilterDef } from "@/types";

/**
 * Filter definitions — docs/06-TEMPLATE-SYSTEM.md §4 (CSS-based, no image asset).
 * Data-driven: add a new object to the array and it appears in every
 * <FilterCarousel /> with zero component changes.
 *
 * Filters are pure CSS, so the carousel thumbnail is a shared inline-SVG
 * "sample face" with the filter applied live (see FILTER_SAMPLE_THUMB).
 */

const SAMPLE_FACE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
  <rect width="80" height="80" fill="#C9A987"/>
  <path d="M16 80 Q40 54 64 80 Z" fill="#5A4A3A"/>
  <circle cx="40" cy="34" r="17" fill="#F2D6C5"/>
  <circle cx="33" cy="32" r="2.4" fill="#3A2E1F"/>
  <circle cx="47" cy="32" r="2.4" fill="#3A2E1F"/>
  <path d="M33 42 Q40 47 47 42" stroke="#9A5B4A" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;

export const FILTER_SAMPLE_THUMB = `data:image/svg+xml,${encodeURIComponent(SAMPLE_FACE_SVG)}`;

export const filters: FilterDef[] = [
  { id: "original", name: "Original", cssFilter: "none" },
  { id: "soft", name: "Soft", cssFilter: "brightness(1.05) contrast(0.95) saturate(0.9)" },
  { id: "warm", name: "Warm", cssFilter: "sepia(0.15) saturate(1.2) brightness(1.05)" },
  { id: "cool", name: "Cool", cssFilter: "hue-rotate(10deg) saturate(1.05) brightness(1.02)" },
  { id: "vintage", name: "Vintage", cssFilter: "sepia(0.35) contrast(1.1) brightness(0.95)" },
  { id: "bw", name: "B & W", cssFilter: "grayscale(1) contrast(1.1)" },
  { id: "contrast", name: "Contrast", cssFilter: "contrast(1.3)" },
  { id: "retro", name: "Retro", cssFilter: "sepia(0.25) hue-rotate(-10deg) saturate(1.3)" },
];

/** Resolve the CSS filter string for a filter id (falls back to 'none'). */
export const getFilterCss = (id: string | null | undefined): string =>
  filters.find((f) => f.id === id)?.cssFilter ?? "none";

export const getFilter = (id: string | null | undefined): FilterDef | undefined =>
  filters.find((f) => f.id === id);
