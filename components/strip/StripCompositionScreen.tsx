"use client";

import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";
import { Heading } from "@/components/ui/Heading";
import { ScreenFooter } from "@/components/ui/ScreenFooter";
import { StripCanvasPreview } from "./StripCanvasPreview";

/**
 * Screen 07 — STRIP_COMPOSITION ("make strip").
 * Minimal host for the canvas render engine (Fase 5): shows the live
 * <StripCanvasPreview /> built from pack + photos + their per-photo edits,
 * with a footer to proceed to the sticker/draw editor. Sticker & drawing
 * interaction lands in Fase 6; this screen exists now so the render engine
 * is testable end-to-end.
 */
export function StripCompositionScreen() {
  const goBack = usePhotoBoothStore((s) => s.goBack);
  const goToStickerDrawEditor = usePhotoBoothStore(
    (s) => s.goToStickerDrawEditor,
  );

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-1 flex-col items-center px-6 py-10">
      <p className="editorial-wide mb-3 text-[10px] text-[var(--muted)]">
        step 07 — make strip
      </p>
      <Heading level={1} className="mb-8 text-center">
        your strip
      </Heading>

      <StripCanvasPreview className="block h-auto max-h-[60dvh] w-full max-w-[240px] rounded-lg shadow-sm" />

      <ScreenFooter
        onBack={() => goBack("editing")}
        onNext={goToStickerDrawEditor}
        nextLabel="add stickers ▷"
      />
    </section>
  );
}
