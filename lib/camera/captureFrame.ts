"use client";

/**
 * captureFrame — docs/08-CAMERA-MODULE.md §3.
 *
 * Grabs the current frame from the live <video> into an offscreen canvas,
 * mirrored horizontally so the saved photo matches what the user saw in the
 * mirrored preview. Returns a JPEG data URL (sufficient as a source; PNG is
 * reserved for final export in Fase 7).
 */
export function captureFrame(video: HTMLVideoElement): string {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Mirror horizontal to match the on-screen preview.
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/jpeg", 0.92);
}
