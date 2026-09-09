"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InstagramGlyph } from "@/components/ui/InstagramGlyph";
import { shareStrip } from "@/lib/utils/share";

interface ShareButtonProps {
  imageDataUrl: string;
  filename?: string;
}

/**
 * <ShareButton /> — gradient "Share to Instagram" (docs/05 §Final & Share,
 * docs/04 Screen 09). Delegates to lib/utils/share.ts (Web Share API + honest
 * fallback). The glyph is an original camera shape, not the IG wordmark.
 *
 * Surfaces a short ephemeral toast with the honest message returned by
 * shareStrip() (e.g. the fallback "ready to share on Instagram" line). Never
 * fabricates an upload success.
 */
export function ShareButton({ imageDataUrl, filename }: ShareButtonProps) {
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(
      () => setToast((cur) => (cur === msg ? null : cur)),
      5000,
    );
  };

  const handleShare = async () => {
    if (busy) return;
    setBusy(true);
    setToast(null);
    try {
      const res = await shareStrip({ imageDataUrl, filename });
      if (res.message) flash(res.message);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[ShareButton] shareStrip failed", err);
      flash("something went wrong — try download instead.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Button
        variant="gradient"
        onClick={handleShare}
        disabled={busy}
        className="w-full py-4"
      >
        <InstagramGlyph className="h-4 w-4" />
        {busy ? "opening…" : "share to instagram"}
      </Button>
      {toast && (
        <p className="editorial-wide max-w-xs text-center text-[10px] text-[var(--muted)]">
          {toast}
        </p>
      )}
    </div>
  );
}
