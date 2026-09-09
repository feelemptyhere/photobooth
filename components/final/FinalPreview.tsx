"use client";

import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";
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
  const resetSession = usePhotoBoothStore((s) => s.resetSession);

  if (!dataUrl) {
    return (
      <div className="flex min-h-[80dvh] w-full flex-col items-center justify-center px-6 text-center">
        <p className="editorial-wide text-[10px] text-[var(--muted)]">
          rendering your strip…
        </p>
      </div>
    );
  }

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
        className="mb-8 max-h-[62dvh] w-auto rounded-lg shadow-sm"
      />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <DownloadButton imageDataUrl={dataUrl} />
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
