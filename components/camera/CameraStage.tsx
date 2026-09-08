"use client";

import { useCallback, useEffect, useState } from "react";
import { useCamera } from "@/lib/camera/useCamera";
import { useCountdown } from "@/lib/camera/useCountdown";
import { captureFrame } from "@/lib/camera/captureFrame";
import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";
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
  const [flash, setFlash] = useState(false);

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

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-10">
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
            style={{ transform: "scaleX(-1)" }} // mirror preview to match captured frame
          />

          {/* Dim overlay while the stream is still starting up */}
          {!ready && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/10">
              <span className="editorial-wide text-[10px] text-paper/80">
                starting camera…
              </span>
            </div>
          )}

          {ready && <CameraCounter index={currentPhotoIndex} total={6} />}
          {showCountdown && <Countdown count={count} />}
          <CaptureFlash active={flash} />
        </div>
      )}

      <p className="editorial-wide mt-6 text-[10px] text-[var(--muted)]">
        {error ? "" : "look at the camera ✦"}
      </p>
    </section>
  );
}
