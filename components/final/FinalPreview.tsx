"use client";

import { useEffect, useState } from "react";
import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";
import { stripPacks, getPack } from "@/lib/templates/stripPacks";
import { exportStrip } from "@/lib/utils/exportStrip";
import { formatDate } from "@/lib/utils/formatDate";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { DownloadButton } from "./DownloadButton";

/**
 * Screen 08 — FINAL_RESULT (docs/04 Screen 08).
 *
 * Minimal host for Fase 6: shows the high-res exported strip (finalImageDataUrl
 * produced by exportStrip on the previous screen's `done ▷`) with Download +
 * Start New. The gradient `Share to Instagram` button + Web Share logic land in
 * Fase 8; the visual + export pipeline is already wired here.
 */
export function FinalPreview() {
  const dataUrl = usePhotoBoothStore((s) => s.session.finalImageDataUrl);
  const packId = usePhotoBoothStore((s) => s.session.packId);
  const photos = usePhotoBoothStore((s) => s.session.photos);
  const stickers = usePhotoBoothStore((s) => s.session.stickers);
  const drawings = usePhotoBoothStore((s) => s.session.drawings);
  const userName = usePhotoBoothStore((s) => s.session.name);
  const finalizeStrip = usePhotoBoothStore((s) => s.finalizeStrip);
  const resetSession = usePhotoBoothStore((s) => s.resetSession);

  const [rendering, setRendering] = useState(false);

  const pack = packId ? getPack(packId) ?? stripPacks[0] : stripPacks[0];

  // Spec: render the high-res export "saat masuk FINAL_RESULT" (docs/09 Fase 7).
  // The editor's `done ▷` just transitions here; if finalImageDataUrl is already
  // present we show it immediately, otherwise we render at scaleFactor=3 →
  // 900×3600 PNG and persist it via finalizeStrip(). Renders client-side only.
  useEffect(() => {
    if (dataUrl || rendering) return;
    let cancelled = false;
    setRendering(true);
    exportStrip({ pack, photos, stickers, drawings, userName })
      .then((url) => {
        if (!cancelled) finalizeStrip(url);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("[FinalPreview] exportStrip failed", err);
      })
      .finally(() => {
        if (!cancelled) setRendering(false);
      });
    return () => {
      cancelled = true;
    };
    // Re-run only when the persisted data URL changes (e.g. after Start New).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUrl]);

  if (!dataUrl) {
    return (
      <div className="flex min-h-[80dvh] w-full flex-col items-center justify-center px-6 text-center">
        <p className="editorial-wide text-[10px] text-[var(--muted)]">
          {rendering ? "rendering your strip…" : "preparing…"}
        </p>
      </div>
    );
  }

  // Filename: "<name>-photobooth-YYYY.MM.DD.png" (sanitized, lowercase).
  const slug = (userName?.trim() || "photobooth")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const datePart = formatDate(new Date()).replace(/\s*\.\s*/g, ".");
  const filename = `${slug}-${datePart}.png`;

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-1 flex-col items-center px-6 py-10">
      <p className="editorial-wide mb-3 text-[10px] text-[var(--muted)]">
        step 09 — all done
      </p>
      <Heading level={1} className="mb-8 text-center">
        all done ♡
      </Heading>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt="your photo strip"
        className="mb-8 max-h-[64dvh] w-auto rounded-lg shadow-sm"
      />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <DownloadButton imageDataUrl={dataUrl} filename={filename} />
        <Button variant="primary" onClick={resetSession}>
          start new
        </Button>
      </div>
      <p className="editorial-wide mt-6 text-[8px] text-[var(--muted)]">
        share — coming next
      </p>
    </section>
  );
}
