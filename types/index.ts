/**
 * Centralized TypeScript interfaces for the Photobooth app.
 * Source of truth per docs/02-TECH-SPEC.md §2.
 * Do NOT deviate from these contracts without a strong technical reason
 * (document the reason in code comments if you must).
 */

export type ThemeColor = "pink" | "blue";

export type SessionStatus =
  | "idle"
  | "setup"
  | "strip_selection"
  | "pack_selection"
  | "camera_permission"
  | "countdown"
  | "capture"
  | "photo_review"
  | "editing"
  | "strip_composition"
  | "sticker_draw_editor"
  | "final_result"
  | "share"
  | "reset";

export interface PhotoBoothSession {
  name: string;
  themeColor: ThemeColor | null;
  stripLayoutId: string | null; // ref to StripLayout.id
  packId: string | null; // ref to StripPack.id
  currentPhotoIndex: number; // 0-5 during capture
  photos: CapturedPhoto[]; // max 6, index-stable
  stickers: PlacedSticker[];
  drawings: DrawingStroke[];
  finalImageDataUrl: string | null;
  status: SessionStatus;
}

export interface CapturedPhoto {
  id: string; // uuid
  slotIndex: number; // 0-5
  imageDataUrl: string; // raw capture result (base64)
  backgroundId: string | null;
  filterId: string; // default: 'original'
  effectId: string | null;
  retaken: boolean;
}

export interface StripLayout {
  id: string; // '1x4' | '2x2' | '1x3'
  name: string;
  slotCount: number;
  gridPreview: string; // ascii/svg key for selection rendering
}

export interface StripPack {
  id: string;
  name: string;
  width: number; // px, in preview resolution (e.g. 300)
  height: number;
  background: string; // hex color / gradient css
  textureUrl?: string; // optional pattern/texture image
  photoSlots: PhotoSlotDef[];
  decorativeElements: DecorativeElement[];
  typography: {
    fontFamily: string;
    footerColor: string;
  };
  footer: {
    showDate: boolean;
    brandText: string;
  };
}

export interface PhotoSlotDef {
  index: number; // which photo goes into this slot
  x: number;
  y: number; // relative position within strip (px on base width/height)
  width: number;
  height: number;
  rotation?: number; // degrees, optional for polaroid-style
  fit: "cover" | "contain";
}

export interface DecorativeElement {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // relative to photoSlots (above/below photos)
}

export interface PlacedSticker {
  id: string;
  stickerAssetId: string;
  x: number;
  y: number; // position in strip canvas (base resolution coordinates)
  scale: number;
  rotation: number;
}

export interface DrawingStroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  thickness: number;
}

export interface FilterDef {
  id: string;
  name: string;
  cssFilter: string; // e.g. 'grayscale(1) contrast(1.1)'
}

export interface BackgroundOption {
  id: string;
  name: string;
  thumbnailUrl: string;
  type: "none" | "color" | "image";
  value: string; // hex color or image url
}

export interface EffectOption {
  id: string;
  name: string;
  thumbnailUrl: string;
  overlayImageUrl: string;
  anchor: "face-top" | "face-center" | "full-frame";
}

export interface StickerAsset {
  id: string;
  name: string;
  category:
    | "hearts"
    | "stars"
    | "flowers"
    | "characters"
    | "bows"
    | "sparkles"
    | "food"
    | "animals"
    | "shapes";
  imageUrl: string;
}