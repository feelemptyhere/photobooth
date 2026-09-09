"use client";

import type { StickerAsset } from "@/types";

interface StickerPickerProps {
  stickers: StickerAsset[];
  onAdd: (assetId: string) => void;
}

const CATEGORIES: StickerAsset["category"][] = [
  "hearts",
  "stars",
  "flowers",
  "characters",
  "bows",
  "sparkles",
  "food",
  "animals",
  "shapes",
];

/**
 * <StickerPicker /> — data-driven sticker grid (docs/05 §StickerPicker).
 * Reads the sticker array (grouped by category); adding one entry to the
 * array surfaces it here with no component change. Tapping a sticker calls
 * onAdd(assetId); the host turns that into a `PlacedSticker` in the store.
 */
export function StickerPicker({ stickers, onAdd }: StickerPickerProps) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      {CATEGORIES.map((cat) => {
        const items = stickers.filter((s) => s.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="flex items-center gap-2">
            <span className="editorial-wide w-16 shrink-0 text-[8px] uppercase text-[var(--muted)]">
              {cat}
            </span>
            <div className="flex flex-wrap gap-2">
              {items.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onAdd(s.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 transition hover:scale-105 hover:bg-ink/10 active:scale-95"
                  aria-label={`add ${s.name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    className="h-6 w-6"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
