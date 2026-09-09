import type { EffectOption } from "@/types";
import { withBasePath } from "@/lib/utils/paths";

/**
 * Face/body effect overlays — docs/06-TEMPLATE-SYSTEM.md §4 / Fase 3.
 * Each points at an original placeholder SVG in /public/assets/effects/.
 * Data-driven: append an object to add an effect with no component change.
 *
 * Asset URLs are prefixed with the Next.js basePath (withBasePath) so they
 * resolve correctly when the app is reverse-proxied under a subpath
 * (abstergo.space/photobooth). basePath MUST mirror next.config.mjs.
 *
 * `anchor` hints where the overlay sits relative to the frame:
 *   face-top    → sits near the top of the frame (ears / hats / crowns)
 *   face-center → centered on the face (glasses)
 *   full-frame  → covers the whole frame (sparkles / bokeh)
 */
export const effects: EffectOption[] = [
  {
    id: "cat-ears",
    name: "Cat Ears",
    thumbnailUrl: withBasePath("/assets/effects/cat-ears.svg"),
    overlayImageUrl: withBasePath("/assets/effects/cat-ears.svg"),
    anchor: "face-top",
  },
  {
    id: "glasses",
    name: "Glasses",
    thumbnailUrl: withBasePath("/assets/effects/glasses.svg"),
    overlayImageUrl: withBasePath("/assets/effects/glasses.svg"),
    anchor: "face-center",
  },
  {
    id: "hearts",
    name: "Hearts",
    thumbnailUrl: withBasePath("/assets/effects/hearts.svg"),
    overlayImageUrl: withBasePath("/assets/effects/hearts.svg"),
    anchor: "full-frame",
  },
  {
    id: "sparkles",
    name: "Sparkles",
    thumbnailUrl: withBasePath("/assets/effects/sparkles.svg"),
    overlayImageUrl: withBasePath("/assets/effects/sparkles.svg"),
    anchor: "full-frame",
  },
];

export const getEffect = (
  id: string | null | undefined,
): EffectOption | undefined => effects.find((e) => e.id === id);
