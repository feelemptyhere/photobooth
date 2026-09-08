import type { BackgroundOption } from "@/types";

/**
 * Background options — docs/06-TEMPLATE-SYSTEM.md §4 / Fase 3 (color placeholders).
 * Data-driven: append an object to add a background with no component change.
 *
 * `type: 'color'` placeholders for now; image backgrounds can be added later by
 * setting `type: 'image'` and `value` to an asset URL — the carousel & editor
 * already handle both via the resolved `value`.
 */

const solidColorUri = (hex: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="${hex}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const backgrounds: BackgroundOption[] = [
  { id: "none", name: "None", thumbnailUrl: solidColorUri("#FAFAFA"), type: "none", value: "transparent" },
  { id: "blush", name: "Blush", thumbnailUrl: solidColorUri("#F3D9DC"), type: "color", value: "#F3D9DC" },
  { id: "sky", name: "Sky", thumbnailUrl: solidColorUri("#BFD8E8"), type: "color", value: "#BFD8E8" },
  { id: "meadow", name: "Meadow", thumbnailUrl: solidColorUri("#E4EFE0"), type: "color", value: "#E4EFE0" },
  { id: "butter", name: "Butter", thumbnailUrl: solidColorUri("#F6E9C4"), type: "color", value: "#F6E9C4" },
  { id: "lilac", name: "Lilac", thumbnailUrl: solidColorUri("#DED3EE"), type: "color", value: "#DED3EE" },
  { id: "ink", name: "Ink", thumbnailUrl: solidColorUri("#2B2B2B"), type: "color", value: "#2B2B2B" },
];

export const getBackground = (
  id: string | null | undefined,
): BackgroundOption | undefined => backgrounds.find((b) => b.id === id);
