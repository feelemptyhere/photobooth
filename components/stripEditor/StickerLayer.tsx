"use client";

import { useRef, useState } from "react";
import type { PlacedSticker } from "@/types";
import { getSticker } from "@/lib/assets/stickers";

interface StickerLayerProps {
  placedStickers: PlacedSticker[];
  onUpdate: (id: string, patch: Partial<PlacedSticker>) => void;
  onRemove: (id: string) => void;
}

// Base strip dimensions (docs/07 — preview 300×1200). Sticker positions are
// stored in these base coords; the overlay maps them to display space via
// percentages so it stays aligned at any preview size.
const BASE_W = 300;
const BASE_H = 1200;
// Matches `baseSize` in renderStrip.drawSticker — intrinsic draw size (px in
// base coords) before the sticker's own `scale`.
const STICKER_BASE = 60;

type Gesture =
  | {
      kind: "move";
      id: string;
      startClientX: number;
      startClientY: number;
      startX: number;
      startY: number;
    }
  | {
      kind: "scale";
      id: string;
      centerX: number;
      centerY: number;
      startDist: number;
      startScale: number;
    }
  | {
      kind: "rotate";
      id: string;
      centerX: number;
      centerY: number;
      startAngle: number;
      startRot: number;
    };

/**
 * <StickerLayer /> — DOM overlay for sticker interaction (docs/05 §StickerLayer).
 *
 * DOM overlay for interaction, canvas (renderStrip) for the final composite —
 * the spec's recommended approach, since drag/rotate/scale are far simpler with
 * pointer events than canvas hit-testing.
 *
 * Positioning is percentage-based relative to the layer (which fills the preview
 * box, same aspect as the 300×1200 base canvas), so the overlay stays aligned
 * with the rendered stickers at any display size. The display→base scale factor
 * `ds` (container width / 300) is read live from getBoundingClientRect during
 * gestures to convert pointer deltas back to base coordinates.
 */
export function StickerLayer({
  placedStickers,
  onUpdate,
  onRemove,
}: StickerLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const gestureRef = useRef<Gesture | null>(null);

  const ds = () => {
    const el = containerRef.current;
    if (!el) return 1;
    return el.clientWidth / BASE_W;
  };

  const capture = (e: React.PointerEvent) => {
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const beginMove = (e: React.PointerEvent, st: PlacedSticker) => {
    e.stopPropagation();
    capture(e);
    setSelectedId(st.id);
    gestureRef.current = {
      kind: "move",
      id: st.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: st.x,
      startY: st.y,
    };
  };

  const beginScale = (e: React.PointerEvent, st: PlacedSticker) => {
    e.stopPropagation();
    capture(e);
    const rect = containerRef.current!.getBoundingClientRect();
    const cx = rect.left + st.x * ds();
    const cy = rect.top + st.y * ds();
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy) || 1;
    gestureRef.current = {
      kind: "scale",
      id: st.id,
      centerX: cx,
      centerY: cy,
      startDist: dist,
      startScale: st.scale,
    };
  };

  const beginRotate = (e: React.PointerEvent, st: PlacedSticker) => {
    e.stopPropagation();
    capture(e);
    const rect = containerRef.current!.getBoundingClientRect();
    const cx = rect.left + st.x * ds();
    const cy = rect.top + st.y * ds();
    const ang = Math.atan2(e.clientY - cy, e.clientX - cx);
    gestureRef.current = {
      kind: "rotate",
      id: st.id,
      centerX: cx,
      centerY: cy,
      startAngle: ang,
      startRot: st.rotation,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gestureRef.current;
    if (!g) return;
    if (g.kind === "move") {
      const f = ds();
      onUpdate(g.id, {
        x: g.startX + (e.clientX - g.startClientX) / f,
        y: g.startY + (e.clientY - g.startClientY) / f,
      });
    } else if (g.kind === "scale") {
      const d = Math.hypot(e.clientX - g.centerX, e.clientY - g.centerY);
      const ratio = d / g.startDist;
      onUpdate(g.id, {
        scale: Math.max(0.2, Math.min(5, g.startScale * ratio)),
      });
    } else {
      const ang = Math.atan2(e.clientY - g.centerY, e.clientX - g.centerX);
      const delta = ((ang - g.startAngle) * 180) / Math.PI;
      onUpdate(g.id, { rotation: g.startRot + delta });
    }
  };

  const endGesture = () => {
    gestureRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ touchAction: "none" }}
      onPointerMove={onPointerMove}
      onPointerUp={endGesture}
      onPointerCancel={endGesture}
      onPointerDown={(e) => {
        // Tap on empty area → deselect.
        if (e.target === e.currentTarget) setSelectedId(null);
      }}
    >
      {placedStickers.map((st) => {
        const asset = getSticker(st.stickerAssetId);
        if (!asset) return null;
        const selected = st.id === selectedId;
        // width % = (STICKER_BASE / BASE_W) * 100 * scale → display px =
        // containerW * (60/300) * scale = 60 * ds * scale (matches drawSticker).
        return (
          <div
            key={st.id}
            className="absolute"
            style={{
              left: `${(st.x / BASE_W) * 100}%`,
              top: `${(st.y / BASE_H) * 100}%`,
              width: `${((STICKER_BASE / BASE_W) * 100) * st.scale}%`,
              transform: `translate(-50%, -50%) rotate(${st.rotation}deg)`,
              touchAction: "none",
              cursor: "move",
            }}
            onPointerDown={(e) => beginMove(e, st)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.imageUrl}
              alt={asset.name}
              className="pointer-events-none block w-full select-none"
              draggable={false}
            />
            {selected && (
              <>
                <span className="pointer-events-none absolute inset-0 rounded-[2px] border border-ink/50" />
                {/* delete */}
                <button
                  type="button"
                  aria-label="delete sticker"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onRemove(st.id);
                    setSelectedId(null);
                  }}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] leading-none text-paper"
                >
                  ×
                </button>
                {/* scale handle (bottom-right corner) */}
                <button
                  type="button"
                  aria-label="resize sticker"
                  onPointerDown={(e) => beginScale(e, st)}
                  className="absolute -bottom-2 -right-2 h-3 w-3 rounded-full border border-paper bg-ink"
                />
                {/* rotate handle (top-center) */}
                <button
                  type="button"
                  aria-label="rotate sticker"
                  onPointerDown={(e) => beginRotate(e, st)}
                  className="absolute -top-3 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-paper bg-ink"
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
