import type { StickerAsset } from "@/types";

/**
 * Sticker assets — data-driven (docs/06-TEMPLATE-SYSTEM.md §4).
 * Append one object to add a sticker; no component code changes. The sticker
 * editor UI (Fase 6) and `renderStrip()` (Fase 5) both read from this array.
 */
export const stickerAssets: StickerAsset[] = [
  { id: "heart", name: "Heart", category: "hearts", imageUrl: "/assets/stickers/heart.svg" },
  { id: "heart-double", name: "Double Heart", category: "hearts", imageUrl: "/assets/stickers/heart-double.svg" },
  { id: "star", name: "Star", category: "stars", imageUrl: "/assets/stickers/star.svg" },
  { id: "star-burst", name: "Star Burst", category: "stars", imageUrl: "/assets/stickers/star-burst.svg" },
  { id: "flower", name: "Flower", category: "flowers", imageUrl: "/assets/stickers/flower.svg" },
  { id: "tulip", name: "Tulip", category: "flowers", imageUrl: "/assets/stickers/tulip.svg" },
  { id: "smiley", name: "Smiley", category: "characters", imageUrl: "/assets/stickers/smiley.svg" },
  { id: "wink", name: "Wink", category: "characters", imageUrl: "/assets/stickers/wink.svg" },
  { id: "bow", name: "Bow", category: "bows", imageUrl: "/assets/stickers/bow.svg" },
  { id: "ribbon", name: "Ribbon", category: "bows", imageUrl: "/assets/stickers/ribbon.svg" },
  { id: "sparkle", name: "Sparkle", category: "sparkles", imageUrl: "/assets/stickers/sparkle.svg" },
  { id: "sparkle-2", name: "Sparkle Duo", category: "sparkles", imageUrl: "/assets/stickers/sparkle-2.svg" },
  { id: "donut", name: "Donut", category: "food", imageUrl: "/assets/stickers/donut.svg" },
  { id: "icecream", name: "Ice Cream", category: "food", imageUrl: "/assets/stickers/icecream.svg" },
  { id: "cat", name: "Cat", category: "animals", imageUrl: "/assets/stickers/cat.svg" },
  { id: "bunny", name: "Bunny", category: "animals", imageUrl: "/assets/stickers/bunny.svg" },
  { id: "circle", name: "Circle", category: "shapes", imageUrl: "/assets/stickers/circle.svg" },
  { id: "triangle", name: "Triangle", category: "shapes", imageUrl: "/assets/stickers/triangle.svg" },
];

export function getSticker(id: string | null | undefined): StickerAsset | undefined {
  if (!id) return undefined;
  return stickerAssets.find((s) => s.id === id);
}
