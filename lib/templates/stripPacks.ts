/**
 * Strip packs — data-driven (docs/06-TEMPLATE-SYSTEM.md §2).
 *
 * Adding a new pack = appending one object to this array. No component code
 * (<PackSelector />, <PackThumbnail />, renderStrip()) needs to change. This
 * is a mandatory architectural requirement (docs/06-TEMPLATE-SYSTEM.md §3).
 *
 * Note: `textureUrl` / decorative `imageUrl` point to placeholder asset paths
 * under /public/assets/pack-textures/. These are optional; the Fase 1
 * <PackThumbnail /> renders a styled <div> using `background` only, real
 * canvas rendering with textures lands in Fase 4.
 */
import type { StripPack } from "@/types";

const BASE_W = 300;
const BASE_H = 1200;

// Shared 6-slot vertical arrangement (1 col × 6 rows) used by every starter
// pack. Future packs may define their own photoSlots layout freely.
const verticalSlots = (x = 20, w = 260, h = 170, gap = 15, startY = 30) =>
  Array.from({ length: 6 }, (_, i) => ({
    index: i,
    x,
    y: startY + i * (h + gap),
    width: w,
    height: h,
    fit: "cover" as const,
  }));

export const stripPacks: StripPack[] = [
  {
    id: "bistro",
    name: "Bistro",
    width: BASE_W,
    height: BASE_H,
    background: "#F7F1E8",
    textureUrl: "/assets/textures/bistro-texture.svg",
    photoSlots: verticalSlots(),
    decorativeElements: [
      {
        id: "bistro-corner-tl",
        imageUrl: "/assets/textures/bistro-corner.svg",
        x: 0,
        y: 0,
        width: 60,
        height: 60,
        zIndex: 10,
      },
    ],
    typography: { fontFamily: "var(--font-instrument-sans)", footerColor: "#3A2E1F" },
    footer: { showDate: true, brandText: "yourbrand.com" },
  },
  {
    id: "sweetheart",
    name: "Sweetheart",
    width: BASE_W,
    height: BASE_H,
    background: "#F3D9DC",
    textureUrl: undefined,
    photoSlots: verticalSlots(),
    decorativeElements: [
      {
        id: "sweetheart-heart-1",
        imageUrl: "/assets/textures/heart-sticker.svg",
        x: 220,
        y: 10,
        width: 40,
        height: 40,
        zIndex: 10,
      },
    ],
    typography: { fontFamily: "var(--font-instrument-sans)", footerColor: "#6B3F3F" },
    footer: { showDate: true, brandText: "yourbrand.com" },
  },
  {
    id: "meadow",
    name: "Meadow",
    width: BASE_W,
    height: BASE_H,
    background: "#E4EFE0",
    photoSlots: verticalSlots(),
    decorativeElements: [],
    typography: { fontFamily: "var(--font-instrument-sans)", footerColor: "#3E4F3A" },
    footer: { showDate: true, brandText: "yourbrand.com" },
  },
  {
    id: "retro-film",
    name: "Retro Film",
    width: BASE_W,
    height: BASE_H,
    background: "#4A3F2F",
    photoSlots: verticalSlots(),
    decorativeElements: [],
    typography: { fontFamily: "var(--font-instrument-sans)", footerColor: "#EDE6D6" },
    footer: { showDate: true, brandText: "yourbrand.com" },
  },
  {
    // 5th pack — added in Fase 4 to prove the data-driven contract: it
    // appeared in <PackSelector /> with zero component changes.
    id: "sunbeam",
    name: "Sunbeam",
    width: BASE_W,
    height: BASE_H,
    background: "#FCE9B8",
    photoSlots: verticalSlots(),
    decorativeElements: [],
    typography: { fontFamily: "var(--font-instrument-sans)", footerColor: "#7A5A1F" },
    footer: { showDate: true, brandText: "yourbrand.com" },
  },
];

/** Lookup helper — used by <StripCanvasPreview /> and the export path. */
export function getPack(id: string): StripPack | undefined {
  return stripPacks.find((p) => p.id === id);
}

