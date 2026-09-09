import type { StickerAsset } from "@/types";

/**
 * Sticker assets — data-driven (docs/06-TEMPLATE-SYSTEM.md §4).
 * Append one object to add a sticker; no component code changes. The sticker
 * editor UI (Fase 6) and `renderStrip()` (Fase 5) both read from this array.
 */
export const stickerAssets: StickerAsset[] = [
  { id: "heart", name: "Heart", category: "hearts", imageUrl: "/assets/stickers/heart.svg" },
  { id: "star", name: "Star", category: "stars", imageUrl: "/assets/stickers/star.svg" },
  { id: "flower", name: "Flower", category: "flowers", imageUrl: "/assets/stickers/flower.svg" },
  { id: "bow", name: "Bow", category: "bows", imageUrl: "/assets/stickers/bow.svg" },
];

export function getSticker(id: string | null | undefined): StickerAsset | undefined {
  if (!id) return undefined;
  return stickerAssets.find((s) => s.id === id);
}
