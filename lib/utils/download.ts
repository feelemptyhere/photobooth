/**
 * Trigger a client-side image download (docs/07 §7).
 */
export function downloadImage(
  dataUrl: string,
  filename = "photobooth-strip.png",
): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
