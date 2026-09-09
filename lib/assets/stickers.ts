import type { StickerAsset } from "@/types";
import { withBasePath } from "@/lib/utils/paths";

/**
 * Sticker assets — data-driven (docs/06-TEMPLATE-SYSTEM.md §4).
 * Append one object to add a sticker; no component code changes. The sticker
 * editor UI (Fase 6) and `renderStrip()` (Fase 5) both read from this array.
 *
 * Asset URLs are prefixed with the Next.js basePath (withBasePath) so they
 * resolve when the app is reverse-proxied under a subpath
 * (abstergo.space/photobooth). basePath MUST mirror next.config.mjs.
 */
export const stickerAssets: StickerAsset[] = [
  { id: "heart", name: "Heart", category: "hearts", imageUrl: withBasePath("/assets/stickers/heart.svg") },
  { id: "heart-double", name: "Double Heart", category: "hearts", imageUrl: withBasePath("/assets/stickers/heart-double.svg") },
  { id: "star", name: "Star", category: "stars", imageUrl: withBasePath("/assets/stickers/star.svg") },
  { id: "star-burst", name: "Star Burst", category: "stars", imageUrl: withBasePath("/assets/stickers/star-burst.svg") },
  { id: "flower", name: "Flower", category: "flowers", imageUrl: withBasePath("/assets/stickers/flower.svg") },
  { id: "tulip", name: "Tulip", category: "flowers", imageUrl: withBasePath("/assets/stickers/tulip.svg") },
  { id: "smiley", name: "Smiley", category: "characters", imageUrl: withBasePath("/assets/stickers/smiley.svg") },
  { id: "wink", name: "Wink", category: "characters", imageUrl: withBasePath("/assets/stickers/wink.svg") },
  { id: "bow", name: "Bow", category: "bows", imageUrl: withBasePath("/assets/stickers/bow.svg") },
  { id: "ribbon", name: "Ribbon", category: "bows", imageUrl: withBasePath("/assets/stickers/ribbon.svg") },
  { id: "sparkle", name: "Sparkle", category: "sparkles", imageUrl: withBasePath("/assets/stickers/sparkle.svg") },
  { id: "sparkle-2", name: "Sparkle Duo", category: "sparkles", imageUrl: withBasePath("/assets/stickers/sparkle-2.svg") },
  { id: "donut", name: "Donut", category: "food", imageUrl: withBasePath("/assets/stickers/donut.svg") },
  { id: "icecream", name: "Ice Cream", category: "food", imageUrl: withBasePath("/assets/stickers/icecream.svg") },
  { id: "cat", name: "Cat", category: "animals", imageUrl: withBasePath("/assets/stickers/cat.svg") },
  { id: "bunny", name: "Bunny", category: "animals", imageUrl: withBasePath("/assets/stickers/bunny.svg") },
  { id: "circle", name: "Circle", category: "shapes", imageUrl: withBasePath("/assets/stickers/circle.svg") },
  { id: "triangle", name: "Triangle", category: "shapes", imageUrl: withBasePath("/assets/stickers/triangle.svg") },
];

export function getSticker(id: string | null | undefined): StickerAsset | undefined {
  if (!id) return undefined;
  return stickerAssets.find((s) => s.id === id);
}
