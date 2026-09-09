"use client";

import { downloadImage } from "@/lib/utils/download";

interface DownloadButtonProps {
  imageDataUrl: string;
  filename?: string;
}

/**
 * <DownloadButton /> — triggers a client-side PNG download (docs/07 §7).
 * Secondary/ghost style per Screen 08 spec.
 */
export function DownloadButton({ imageDataUrl, filename }: DownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={() => downloadImage(imageDataUrl, filename)}
      className="editorial rounded-full bg-ink/5 px-6 py-3 text-xs tracking-editorial text-ink/80 transition hover:bg-ink/10"
    >
      download
    </button>
  );
}
