import type { StripPack } from "@/types";

/**
 * Mini pack-preview renderer (Fase 4). Draws a faithful miniature of a strip
 * pack purely from its data: background, optional texture, photo-slot
 * placeholders (or supplied photos), decorative elements, and footer.
 *
 * This is intentionally separate from the full `renderStrip()` engine that
 * lands in Fase 5 — the pack selector needs a lightweight, photo-agnostic
 * preview at PACK_SELECTION (no captures exist yet).
 *
 * Data-driven: any new pack object renders here with zero code changes.
 */
export interface RenderPackPreviewOptions {
  /** Target preview width in CSS px (height scales to pack aspect). */
  maxWidth?: number;
  /** Optional per-slot photo data URLs; missing slots render as placeholders. */
  photos?: (string | null | undefined)[];
}

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/** Draw an image into a rect using object-fit: cover semantics. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) {
    ctx.fillRect(dx, dy, dw, dh);
    return;
  }
  const target = dw / dh;
  const ratio = iw / ih;
  let sw: number;
  let sh: number;
  let sx = 0;
  let sy = 0;
  if (ratio > target) {
    sh = ih;
    sw = ih * target;
    sx = (iw - sw) / 2;
  } else {
    sw = iw;
    sh = iw / target;
    sy = (ih - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

export async function renderPackPreview(
  canvas: HTMLCanvasElement,
  pack: StripPack,
  opts: RenderPackPreviewOptions = {},
): Promise<void> {
  const maxWidth = opts.maxWidth ?? 80;
  const scale = maxWidth / pack.width;
  const w = pack.width * scale;
  const h = pack.height * scale;
  const dpr =
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  canvas.width = Math.max(1, Math.round(w * dpr));
  canvas.height = Math.max(1, Math.round(h * dpr));
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  // 1. Background fill.
  ctx.fillStyle = pack.background;
  ctx.fillRect(0, 0, w, h);

  // 2. Optional texture overlay (drawn cover, faded).
  if (pack.textureUrl) {
    try {
      const tex = await loadImage(pack.textureUrl);
      ctx.globalAlpha = 0.45;
      ctx.drawImage(tex, 0, 0, w, h);
      ctx.globalAlpha = 1;
    } catch {
      /* missing texture is non-fatal — skip gracefully */
    }
  }

  // 3. Photo slots (placeholder rects, or supplied photos).
  const photos = opts.photos ?? [];
  const loaded: Record<number, HTMLImageElement> = {};
  await Promise.all(
    pack.photoSlots.map(async (slot) => {
      const src = photos[slot.index];
      if (!src) return;
      try {
        loaded[slot.index] = await loadImage(src);
      } catch {
        /* leave as placeholder */
      }
    }),
  );
  for (const slot of pack.photoSlots) {
    const sx = slot.x * scale;
    const sy = slot.y * scale;
    const sw = slot.width * scale;
    const sh = slot.height * scale;
    const img = loaded[slot.index];
    if (img) {
      drawCover(ctx, img, sx, sy, sw, sh);
    } else {
      ctx.fillStyle = "rgba(0,0,0,0.10)";
      ctx.fillRect(sx, sy, sw, sh);
    }
  }

  // 4. Decorative elements (sorted by zIndex).
  const decos = [...pack.decorativeElements].sort(
    (a, b) => a.zIndex - b.zIndex,
  );
  for (const dec of decos) {
    try {
      const dimg = await loadImage(dec.imageUrl);
      ctx.drawImage(
        dimg,
        dec.x * scale,
        dec.y * scale,
        dec.width * scale,
        dec.height * scale,
      );
    } catch {
      /* skip missing decorative asset */
    }
  }

  // 5. Footer (brand text + optional date). Note: CSS font vars don't resolve
  //    on canvas, so a sans-serif fallback is used here; the real editorial
  //    font is applied in the final export (Fase 5/7).
  const footerColor = pack.typography.footerColor;
  ctx.fillStyle = footerColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const baseFont = Math.max(6, 11 * scale);
  const footerY = h - Math.max(6, 8 * scale);
  if (pack.footer.showDate) {
    ctx.font = `${Math.max(5, 8 * scale)}px sans-serif`;
    ctx.fillText(
      new Date().toLocaleDateString(),
      w / 2,
      footerY - baseFont - 2 * scale,
    );
  }
  ctx.font = `${baseFont}px sans-serif`;
  ctx.fillText(pack.footer.brandText, w / 2, footerY);
}
