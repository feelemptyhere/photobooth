import type {
  CapturedPhoto,
  DrawingStroke,
  PhotoSlotDef,
  PlacedSticker,
  StripPack,
} from "@/types";
import { getFilterCss } from "@/lib/assets/filters";
import { getEffect } from "@/lib/assets/effects";
import { getBackground } from "@/lib/assets/backgrounds";
import { getSticker } from "@/lib/assets/stickers";
import { formatDate } from "@/lib/utils/formatDate";

export interface RenderStripParams {
  canvas: HTMLCanvasElement;
  pack: StripPack;
  photos: CapturedPhoto[];
  stickers: PlacedSticker[];
  drawings: DrawingStroke[];
  userName?: string;
  /** 1 = preview base resolution (300×1200), 3 = export resolution. */
  scaleFactor: number;
}

// Module-level image cache — prevents reloading on every live re-render
// (docs/07 §3.4).
const imageCache = new Map<string, HTMLImageElement>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

/** Manual object-fit (cover/contain) — crop rect on the source image. */
export function computeSourceRect(
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
  fit: "cover" | "contain",
): { sx: number; sy: number; sw: number; sh: number } {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return { sx: 0, sy: 0, sw: iw, sh: ih };
  const target = targetW / targetH;
  const ratio = iw / ih;
  if (fit === "cover") {
    if (ratio > target) {
      const sh = ih;
      const sw = ih * target;
      return { sx: (iw - sw) / 2, sy: 0, sw, sh };
    }
    const sw = iw;
    const sh = iw / target;
    return { sx: 0, sy: (ih - sh) / 2, sw, sh };
  }
  if (ratio > target) {
    const sw = iw;
    const sh = iw / target;
    return { sx: 0, sy: (ih - sh) / 2, sw, sh };
  }
  const sh = ih;
  const sw = ih * target;
  return { sx: (iw - sw) / 2, sy: 0, sw, sh };
}

/** Draw a captured photo into its slot with per-photo effects applied. */
async function drawPhotoIntoSlot(
  ctx: CanvasRenderingContext2D,
  photo: CapturedPhoto,
  slot: PhotoSlotDef,
): Promise<void> {
  let img: HTMLImageElement;
  try {
    img = await loadImage(photo.imageDataUrl);
  } catch {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.10)";
    ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
    ctx.restore();
    return;
  }

  ctx.save();

  if (slot.rotation) {
    const cx = slot.x + slot.width / 2;
    const cy = slot.y + slot.height / 2;
    ctx.translate(cx, cy);
    ctx.rotate((slot.rotation * Math.PI) / 180);
    ctx.translate(-cx, -cy);
  }

  // Per-photo background behind (visible only where photo is transparent —
  // docs/07 §2 layer 4). Captures are opaque so this is a structural no-op.
  const bg = getBackground(photo.backgroundId);
  if (bg?.type === "color") {
    ctx.fillStyle = bg.value;
    ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
  }

  const { sx, sy, sw, sh } = computeSourceRect(
    img,
    slot.width,
    slot.height,
    slot.fit,
  );

  // Apply CSS filter to the photo BEFORE drawing (docs/07 §2 layer 4).
  const filterCss = getFilterCss(photo.filterId);
  if (filterCss && filterCss !== "none") {
    ctx.filter = filterCss;
  }
  ctx.drawImage(img, sx, sy, sw, sh, slot.x, slot.y, slot.width, slot.height);
  ctx.filter = "none";

  // Effect overlay on top of the photo, anchored within the slot.
  if (photo.effectId) {
    const eff = getEffect(photo.effectId);
    if (eff) {
      try {
        const overlay = await loadImage(eff.overlayImageUrl);
        const ow = slot.width * 0.7;
        const oh = overlay.width > 0 ? (ow * overlay.height) / overlay.width : ow;
        const ox = slot.x + (slot.width - ow) / 2;
        const oy =
          eff.anchor === "face-top"
            ? slot.y + slot.height * 0.02
            : eff.anchor === "face-center"
              ? slot.y + slot.height * 0.28
              : slot.y;
        ctx.drawImage(overlay, ox, oy, ow, oh);
      } catch {
        /* skip */
      }
    }
  }

  ctx.restore();
}

/** Draw a placed sticker (docs/07 §6). */
async function drawSticker(
  ctx: CanvasRenderingContext2D,
  sticker: PlacedSticker,
): Promise<void> {
  const asset = getSticker(sticker.stickerAssetId);
  if (!asset) return;
  let img: HTMLImageElement;
  try {
    img = await loadImage(asset.imageUrl);
  } catch {
    return;
  }
  ctx.save();
  ctx.translate(sticker.x, sticker.y);
  ctx.rotate((sticker.rotation * Math.PI) / 180);
  ctx.scale(sticker.scale, sticker.scale);
  const baseSize = 60;
  ctx.drawImage(img, -baseSize / 2, -baseSize / 2, baseSize, baseSize);
  ctx.restore();
}

/** Draw a freehand user stroke (docs/07 §5). */
function drawStroke(ctx: CanvasRenderingContext2D, stroke: DrawingStroke): void {
  if (stroke.points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.thickness;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length; i++) {
    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  }
  ctx.stroke();
  ctx.restore();
}

/** Footer: date (YYYY . MM . DD) + brand text (docs/07 §3.5). */
function drawFooter(ctx: CanvasRenderingContext2D, pack: StripPack): void {
  if (!pack.footer.showDate && !pack.footer.brandText) return;
  ctx.save();
  ctx.fillStyle = pack.typography.footerColor;
  // CSS font vars (var(--font-...)) don't resolve on canvas; sans-serif
  // fallback used. Editorial font applied via DOM in export wrapper if needed.
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  const footerY = pack.height - 30;
  if (pack.footer.showDate) {
    ctx.fillText(formatDate(new Date()), pack.width / 2, footerY);
  }
  if (pack.footer.brandText) {
    ctx.fillText(pack.footer.brandText, pack.width / 2, footerY + 16);
  }
  ctx.restore();
}

/**
 * Pure & deterministic strip renderer (docs/07 §3.1). Same function serves the
 * live preview (scaleFactor=1) and final export (scaleFactor=3). Compositing
 * order follows §2 exactly.
 */
export async function renderStrip(params: RenderStripParams): Promise<void> {
  const { canvas, pack, photos, stickers, drawings, userName, scaleFactor } =
    params;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // setTransform (not ctx.scale) so repeated renders don't accumulate scale.
  canvas.width = pack.width * scaleFactor;
  canvas.height = pack.height * scaleFactor;
  ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
  ctx.clearRect(0, 0, pack.width, pack.height);

  // 1. Background
  ctx.fillStyle = pack.background;
  ctx.fillRect(0, 0, pack.width, pack.height);

  // 2. Texture
  if (pack.textureUrl) {
    try {
      const tex = await loadImage(pack.textureUrl);
      ctx.drawImage(tex, 0, 0, pack.width, pack.height);
    } catch {
      /* skip */
    }
  }

  // 3 & 4. Photo slots + per-photo effects
  for (const slot of pack.photoSlots) {
    const photo = photos[slot.index];
    if (!photo) continue;
    await drawPhotoIntoSlot(ctx, photo, slot);
  }

  // 5. Frame — folded into decorativeElements per §2 note.

  // 6. Decorative elements (zIndex order)
  const decos = [...pack.decorativeElements].sort(
    (a, b) => a.zIndex - b.zIndex,
  );
  for (const el of decos) {
    try {
      const img = await loadImage(el.imageUrl);
      ctx.drawImage(img, el.x, el.y, el.width, el.height);
    } catch {
      /* skip */
    }
  }

  // 7. Stickers
  for (const sticker of stickers) {
    await drawSticker(ctx, sticker);
  }

  // 8. Drawings
  for (const stroke of drawings) {
    drawStroke(ctx, stroke);
  }

  // 9. Text (userName) — centered above footer
  if (userName?.trim()) {
    ctx.save();
    ctx.fillStyle = pack.typography.footerColor;
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(userName, pack.width / 2, pack.height - 60);
    ctx.restore();
  }

  // 10. Footer
  drawFooter(ctx, pack);
}
