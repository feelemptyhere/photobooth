"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraErrorType =
  | "permission_denied"
  | "not_found"
  | "not_supported"
  | "stream_failure"
  | null;

/**
 * useCamera — docs/08-CAMERA-MODULE.md §1.
 *
 * Owns the MediaStream lifecycle: `requestPermission()` opens a user-facing
 * stream and attaches it to `videoRef`; `stopStream()` tears every track down
 * and clears `srcObject`. The unmount effect guarantees cleanup (checklist §7)
 * even if the component is removed mid-stream.
 */
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<CameraErrorType>(null);
  const [ready, setReady] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setReady(false);
  }, []);

  const requestPermission = useCallback(async () => {
    setError(null);
    setReady(false);
    // Tear down any stream left over from a previous request (retry after an
    // error, or a re-entry) before opening a new one — otherwise the old
    // MediaStream tracks keep running and are never stopped until unmount
    // (Fase 10 memory-leak audit, checklist docs/08 §7).
    stopStream();

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("not_supported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setReady(true);
    } catch (err) {
      const name = (err as DOMException)?.name;
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setError("permission_denied");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setError("not_found");
      } else {
        setError("stream_failure");
      }
    }
    // stopStream is stable (useCallback []), so this never re-creates the
    // callback — listing it only satisfies exhaustive-deps now that we call it.
  }, [stopStream]);

  // Cleanup on unmount — mandatory (checklist §7).
  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  return { videoRef, error, ready, requestPermission, stopStream };
}
