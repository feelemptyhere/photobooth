import { renderStrip } from "@/lib/canvas/renderStrip";
import type {
  CapturedPhoto,
  DrawingStroke,
  PlacedSticker,
  StripPack,
} from "@/types";

export interface ExportStripParams {
  pack: StripPack;
  photos: CapturedPhoto[];
  stickers: PlacedSticker[];
  drawings: DrawingStroke[];
  userName?: string;
}

/**
 * Render the strip to an offscreen canvas at export resolution
 * (scaleFactor = 3 → 900×3600 for a 300×1200 pack) and return a PNG data URL.
 * Reuses the same `renderStrip()` as the live preview (docs/07 §4).
 */
export async function exportStrip(
  params: ExportStripParams,
): Promise<string> {
  const canvas = document.createElement("canvas");
  await renderStrip({
    canvas,
    pack: params.pack,
    photos: params.photos,
    stickers: params.stickers,
    drawings: params.drawings,
    userName: params.userName,
    scaleFactor: 3,
  });
  return canvas.toDataURL("image/png");
}
