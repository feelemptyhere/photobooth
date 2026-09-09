"use client";

import { useState } from "react";
import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";
import { stripPacks, getPack } from "@/lib/templates/stripPacks";
import { stickerAssets } from "@/lib/assets/stickers";
import { Heading } from "@/components/ui/Heading";
import { ScreenFooter } from "@/components/ui/ScreenFooter";
import { StripCanvasPreview } from "@/components/strip/StripCanvasPreview";
import { StickerPicker } from "./StickerPicker";
import { StickerLayer } from "./StickerLayer";
import { DrawingCanvas } from "./DrawingCanvas";
import { DrawToolbar } from "./DrawToolbar";

type Mode = "stickers" | "draw";

/**
 * Screen 08 — STICKER_DRAW_EDITOR (docs/04 Screen 07 "Stickers / Draw").
 *
 * Composes the live <StripCanvasPreview /> with two interaction overlays:
 *  - <StickerLayer />  — drag/scale/rotate/delete DOM stickers.
 *  - <DrawingCanvas /> — freehand strokes (base-res overlay).
 *
 * Both overlay layers read/write the same store fields (stickers / drawings)
 * that renderStrip composites, so the preview + final export stay in sync
 * automatically (the preview is debounced inside StripCanvasPreview).
 *
 * Skippable: tapping `done ▷` with zero stickers/drawings is valid.
 */
export function StickerDrawEditor() {
  const packId = usePhotoBoothStore((s) => s.session.packId);
  const stickers = usePhotoBoothStore((s) => s.session.stickers);

  const addSticker = usePhotoBoothStore((s) => s.addSticker);
  const updateSticker = usePhotoBoothStore((s) => s.updateSticker);
  const removeSticker = usePhotoBoothStore((s) => s.removeSticker);
  const addDrawingStroke = usePhotoBoothStore((s) => s.addDrawingStroke);
  const clearDrawings = usePhotoBoothStore((s) => s.clearDrawings);
  const undoDrawing = usePhotoBoothStore((s) => s.undoDrawing);
  const goToFinalResult = usePhotoBoothStore((s) => s.goToFinalResult);
  const goBack = usePhotoBoothStore((s) => s.goBack);

  const pack = packId ? getPack(packId) ?? stripPacks[0] : stripPacks[0];

  const [mode, setMode] = useState<Mode>("stickers");
  const [drawActive, setDrawActive] = useState(false);
  const [drawColor, setDrawColor] = useState("#1A1A1A");
  const [drawThickness, setDrawThickness] = useState(5);

  const handleAddSticker = (assetId: string) => {
    addSticker({
      id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      stickerAssetId: assetId,
      // Drop near the upper-center of the strip.
      x: pack.width / 2,
      y: pack.height * 0.28,
      scale: 1,
      rotation: 0,
    });
  };

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-1 flex-col items-center px-6 py-10">
      <p className="editorial-wide mb-3 text-[10px] text-[var(--muted)]">
        step 08 — stickers &amp; draw
      </p>
      <Heading level={1} className="mb-6 text-center">
        make it yours
      </Heading>

      {/* Mode toggle */}
      <div className="mb-5 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("stickers")}
          className="editorial rounded-full px-5 py-2 text-[10px] tracking-editorial transition"
          style={{
            backgroundColor: mode === "stickers" ? "var(--ink)" : "rgba(0,0,0,0.05)",
            color: mode === "stickers" ? "var(--paper)" : "var(--ink)",
          }}
        >
          ✧ stickers
        </button>
        <button
          type="button"
          onClick={() => setMode("draw")}
          className="editorial rounded-full px-5 py-2 text-[10px] tracking-editorial transition"
          style={{
            backgroundColor: mode === "draw" ? "var(--ink)" : "rgba(0,0,0,0.05)",
            color: mode === "draw" ? "var(--paper)" : "var(--ink)",
          }}
        >
          draw
        </button>
      </div>

      {/* Preview + overlays. inline-block wrapper shrinks to the canvas display
          size; overlays are absolute inset-0 over that exact box (1:4 aspect). */}
      <div className="relative inline-block">
        <StripCanvasPreview className="block max-h-[58dvh] max-w-[240px] rounded-lg shadow-sm" />
        <StickerLayer
          placedStickers={stickers}
          onUpdate={updateSticker}
          onRemove={removeSticker}
        />
        <DrawingCanvas
          active={mode === "draw" && drawActive}
          color={drawColor}
          thickness={drawThickness}
          onStrokeComplete={addDrawingStroke}
        />
      </div>

      {/* Tool panel */}
      <div className="mt-6 w-full max-w-[360px]">
        {mode === "stickers" ? (
          <StickerPicker stickers={stickerAssets} onAdd={handleAddSticker} />
        ) : (
          <DrawToolbar
            active={drawActive}
            color={drawColor}
            thickness={drawThickness}
            onToggleActive={() => setDrawActive((v) => !v)}
            onColorChange={setDrawColor}
            onThicknessChange={setDrawThickness}
            onErase={undoDrawing}
            onClearAll={clearDrawings}
          />
        )}
      </div>

      <ScreenFooter
        onBack={() => goBack("strip_composition")}
        onNext={goToFinalResult}
        nextLabel="done ▷"
      />
    </section>
  );
}
