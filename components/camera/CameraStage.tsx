"use client";

import { useCallback, useEffect, useState } from "react";
import { useCamera } from "@/lib/camera/useCamera";
import { useCountdown } from "@/lib/camera/useCountdown";
import { captureFrame } from "@/lib/camera/captureFrame";
import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";
import { filters, getFilterCss } from "@/lib/assets/filters";
import { backgrounds, getBackground } from "@/lib/assets/backgrounds";
import { effects, getEffect } from "@/lib/assets/effects";
import { FilterCarousel } from "@/components/effects/FilterCarousel";
import { BackgroundCarousel } from "@/components/effects/BackgroundCarousel";
import { EffectCarousel } from "@/components/effects/EffectCarousel";
import { CameraCounter } from "./CameraCounter";
import { Countdown } from "./Countdown";
import { CaptureFlash } from "./CaptureFlash";
import { CameraErrorState } from "./CameraErrorState";

/**
 * CameraStage (Screen 04) — orchestrates the capture loop per
 * docs/08-CAMERA-MODULE.md §5:
 *   requestPermission → ready → start countdown → capture → store.capturePhoto
 *   → (idx<5) re-countdown for next | (idx===5) store advances to PHOTO_REVIEW
 *   → unmount → stopStream().
 *
 * AppShell keeps this component mounted across camera_permission/countdown/
 * capture by collapsing those statuses into a single screenKey ("camera"), so
 * the live <video> + MediaStream never remount mid-loop.
 */
export function CameraStage() {
  const { videoRef, error, ready, requestPermission, stopStream } = useCamera();
  const status = usePhotoBoothStore((s) => s.status);
  const currentPhotoIndex = usePhotoBoothStore(
    (s) => s.session.currentPhotoIndex,
  );
  const startCountdown = usePhotoBoothStore((s) => s.startCountdown);
  const capturePhoto = usePhotoBoothStore((s) => s.capturePhoto);
  const retakeSlotIndex = usePhotoBoothStore((s) => s.retakeSlotIndex);
  const [flash, setFlash] = useState(false);

  // Live-preview selections (camera carousels are preview-only — the actual
  // per-photo filter/background/effect is chosen in <PhotoEditor /> (Screen 05).
  const [previewFilterId, setPreviewFilterId] = useState("original");
  const [previewBgId, setPreviewBgId] = useState("none");
  const [previewEffectId, setPreviewEffectId] = useState<string | null>(null);

  const previewFilterCss = getFilterCss(previewFilterId);
  const previewBgValue =
    getBackground(previewBgId)?.value ?? "transparent";
  const previewEffect = getEffect(previewEffectId);

  const handleCountdownComplete = useCallback(() => {
    if (!videoRef.current) return;
    const dataUrl = captureFrame(videoRef.current);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 180);
    // Store auto-increments index and either re-enters COUNTDOWN (more photos)
    // or advances to PHOTO_REVIEW on the 6th capture.
    capturePhoto(dataUrl);
  }, [capturePhoto]);

  const { count, start } = useCountdown(handleCountdownComplete);

  // 1. Request camera permission on mount.
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // 2. Once the stream is ready and we're still in CAMERA_PERMISSION,
  //    enter the COUNTDOWN status to begin the loop.
  useEffect(() => {
    if (ready && status === "camera_permission") {
      startCountdown();
    }
  }, [ready, status, startCountdown]);

  // 3. While in COUNTDOWN, fire the timer once per photo index
  //    (guard `count === null` prevents double-firing).
  useEffect(() => {
    if (status === "countdown" && count === null && currentPhotoIndex <= 5) {
      start();
    }
  }, [status, count, currentPhotoIndex, start]);

  // 4. Stop the stream when CameraStage unmounts (leaving camera screens).
  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  const showCountdown = status === "countdown" && count !== null;
  const isRetake = retakeSlotIndex !== null;

  return (
    <section
      className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-6 lg:py-10"
      style={{ backgroundColor: ready ? previewBgValue : undefined }}
    >
      {error ? (
        <CameraErrorState errorType={error} onRetry={requestPermission} />
      ) : (
        <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl bg-ink/5">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
            style={{ transform: "scaleX(-1)", filter: previewFilterCss }}
          />

          {/* Effect overlay (live preview) */}
          {ready && previewEffect && (
            <img
              src={previewEffect.overlayImageUrl}
              alt={previewEffect.name}
              className="pointer-events-none absolute left-1/2 w-[70%] -translate-x-1/2"
              style={{
                top:
                  previewEffect.anchor === "face-top"
                    ? "2%"
                    : previewEffect.anchor === "face-center"
                      ? "28%"
                      : "0",
              }}
            />
          )}

          {/* Dim overlay while the stream is still starting up */}
          {!ready && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/10">
              <span className="editorial-wide text-[10px] text-paper/80">
                starting camera…
              </span>
            </div>
          )}

          {ready &&
            (isRetake ? (
              <span className="absolute left-0 top-0 p-4 editorial-wide text-[10px] text-paper/90 drop-shadow">
                retake photo {retakeSlotIndex! + 1}
              </span>
            ) : (
              <CameraCounter index={currentPhotoIndex} total={6} />
            ))}
          {showCountdown && <Countdown count={count} />}
          <CaptureFlash active={flash} />
        </div>
      )}

      {/* Live-preview carousels (Screen 04 overlay controls) */}
      {!error && ready && (
        <div className="mt-5 flex w-full max-w-md flex-col gap-4 lg:mt-6 lg:gap-5">
          <FilterCarousel
            options={filters}
            selectedId={previewFilterId}
            onSelect={setPreviewFilterId}
          />
          <BackgroundCarousel
            options={backgrounds}
            selectedId={previewBgId}
            onSelect={setPreviewBgId}
          />
          <EffectCarousel
            options={effects}
            selectedId={previewEffectId}
            onSelect={(id) => setPreviewEffectId(id === previewEffectId ? null : id)}
          />
        </div>
      )}

      <p className="editorial-wide mt-6 text-[10px] text-[var(--muted)]">
        {error ? "" : "look at the camera ✦"}
      </p>
    </section>
  );
}
