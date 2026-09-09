/**
 * lib/utils/share.ts — Web Share API + honest fallback
 * (docs/04-SCREENS-SPEC.md Screen 09, docs/03-STATE-MACHINE.md SHARE).
 *
 * IMPORTANT: Instagram has no direct web upload API. We never claim a share
 * "succeeded" as an upload — we only open the native share sheet (with the PNG
 * file) when supported, otherwise we fall back to a plain download + an honest
 * message telling the user the strip is ready to share manually.
 */
import { downloadImage } from "@/lib/utils/download";

export interface ShareResult {
  /**
   * - "shared": native share sheet opened (we don't know/claim the destination).
   * - "fallback": unsupported/failed → triggered a download instead.
   * - "cancelled": user dismissed the share sheet (AbortError) → no download.
   */
  method: "shared" | "fallback" | "cancelled";
  /** Honest user-facing message (empty when nothing should be surfaced). */
  message: string;
}

const FALLBACK_MSG = "Your photo strip is ready to share on Instagram.";

/**
 * Convert a PNG data URL → a File suitable for navigator.share({ files }).
 */
async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: "image/png" });
}

/**
 * Attempt native Web Share with the exported PNG. Falls back to a download +
 * honest message when unsupported or when sharing fails. Never reports false
 * success.
 */
export async function shareStrip(opts: {
  imageDataUrl: string;
  filename?: string;
}): Promise<ShareResult> {
  const filename = opts.filename ?? "photobooth-strip.png";

  // No Web Share API at all (older desktop browsers) → honest fallback.
  if (typeof navigator === "undefined" || !("share" in navigator)) {
    await downloadImage(opts.imageDataUrl, filename);
    return { method: "fallback", message: FALLBACK_MSG };
  }

  try {
    const file = await dataUrlToFile(opts.imageDataUrl, filename);
    const shareData: ShareData = {
      files: [file],
      title: "My Photo Strip",
      text: "Made with Photobooth",
    };

    // canShare may be absent on some browsers; guard before calling.
    const canShareFiles =
      typeof navigator.canShare === "function" && navigator.canShare(shareData);

    if (canShareFiles) {
      await navigator.share(shareData);
      // Sheet opened & closed. We don't claim an upload — keep it neutral.
      return { method: "shared", message: "Shared." };
    }

    // File-level sharing not supported → download + honest message.
    await downloadImage(opts.imageDataUrl, filename);
    return { method: "fallback", message: FALLBACK_MSG };
  } catch (err) {
    // User dismissed the share sheet — not a failure; don't download.
    if (err instanceof DOMException && err.name === "AbortError") {
      return { method: "cancelled", message: "" };
    }
    // Any other error → honest fallback download + message.
    // eslint-disable-next-line no-console
    console.error("[share] navigator.share failed", err);
    await downloadImage(opts.imageDataUrl, filename);
    return { method: "fallback", message: FALLBACK_MSG };
  }
}
