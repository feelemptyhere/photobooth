"use client";

import { useEffect, useRef } from "react";
import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";
import { stripPacks, getPack } from "@/lib/templates/stripPacks";
import { renderStrip } from "@/lib/canvas/renderStrip";

interface StripCanvasPreviewProps {
  /** 1 = preview base (300×1200). Defaults to 1. Use 3 for export. */
  scaleFactor?: number;
  className?: string;
  /** Called once the canvas has been (re)painted with the latest strip. */
  onReady?: (canvas: HTMLCanvasElement) => void;
}

/**
 * <StripCanvasPreview /> — live strip preview powered by `renderStrip()`
 * (docs/07 §4). Re-renders (debounced ~100ms) whenever photos, stickers, or
 * drawings change so dragging stickers doesn't thrash the canvas.
 */
export function StripCanvasPreview({
  scaleFactor = 1,
  className,
  onReady,
}: StripCanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Hold onReady in a ref so an inline parent callback doesn't retrigger the
  // paint effect on every render.
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const packId = usePhotoBoothStore((s) => s.session.packId);
  const photos = usePhotoBoothStore((s) => s.session.photos);
  const stickers = usePhotoBoothStore((s) => s.session.stickers);
  const drawings = usePhotoBoothStore((s) => s.session.drawings);
  const userName = usePhotoBoothStore((s) => s.session.name);

  const pack = packId ? getPack(packId) ?? stripPacks[0] : undefined;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pack) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      renderStrip({
        canvas,
        pack,
        photos,
        stickers,
        drawings,
        userName,
        scaleFactor,
      }).then(() => {
        if (!cancelled) onReadyRef.current?.(canvas);
      });
    }, 100);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pack, photos, stickers, drawings, userName, scaleFactor]);

  if (!pack) {
    return (
      <p className="editorial-wide text-[10px] text-[var(--muted)]">
        no pack selected
      </p>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "block h-auto w-full max-w-[260px] rounded-md"}
    />
  );
}
