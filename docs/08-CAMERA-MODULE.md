# Camera Module Specification

## 1. `useCamera()` Hook

```typescript
// lib/camera/useCamera.ts
import { useRef, useState, useCallback, useEffect } from 'react';

export type CameraErrorType =
  | 'permission_denied'
  | 'not_found'
  | 'not_supported'
  | 'stream_failure'
  | null;

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<CameraErrorType>(null);
  const [ready, setReady] = useState(false);

  const requestPermission = useCallback(async () => {
    setError(null);
    setReady(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('not_supported');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setReady(true);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('permission_denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('not_found');
      } else {
        setError('stream_failure');
      }
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setReady(false);
  }, []);

  useEffect(() => {
    return () => stopStream(); // cleanup wajib saat unmount
  }, [stopStream]);

  return { videoRef, error, ready, requestPermission, stopStream };
}
```

## 2. Pesan Error yang Human-Friendly (WAJIB, dilarang tampilkan raw JS error)

| `errorType` | Pesan ke user | Aksi tombol |
|---|---|---|
| `permission_denied` | "We need access to your camera to take your photos." | `[ Try Again ]` → panggil `requestPermission()` lagi |
| `not_found` | "We couldn't find a camera on this device." | `[ Try Again ]` |
| `not_supported` | "Your browser doesn't support camera access. Try a different browser." | tidak ada retry, sarankan browser lain |
| `stream_failure` | "Something went wrong starting your camera." | `[ Try Again ]` |

Komponen `<CameraErrorState errorType={error} onRetry={requestPermission} />` menampilkan mapping di atas.

## 3. Capture Frame ke Image

```typescript
// dipanggil setelah countdown selesai
function captureFrame(video: HTMLVideoElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d')!;

  // mirror horizontal agar hasil capture sesuai apa yang dilihat user di preview
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/jpeg', 0.92); // JPEG cukup untuk source, PNG dipakai di final export saja
}
```

## 4. `useCountdown()` Hook

```typescript
// lib/camera/useCountdown.ts
import { useState, useCallback, useRef } from 'react';

export function useCountdown(onComplete: () => void, from = 3, stepMs = 800) {
  const [count, setCount] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const start = useCallback(() => {
    let current = from;
    setCount(current);

    const tick = () => {
      current -= 1;
      if (current <= 0) {
        setCount(null);
        onComplete();
        return;
      }
      setCount(current);
      timerRef.current = setTimeout(tick, stepMs);
    };

    timerRef.current = setTimeout(tick, stepMs);
  }, [from, stepMs, onComplete]);

  return { count, start };
}
```

## 5. Alur Capture Loop (Screen 04) — Kontrak Orchestration

```typescript
// pseudocode di <CameraStage />
useEffect(() => {
  requestPermission();
}, []);

useEffect(() => {
  if (ready && currentPhotoIndex <= 5) {
    countdown.start();
  }
}, [ready, currentPhotoIndex]);

function handleCountdownComplete() {
  const dataUrl = captureFrame(videoRef.current!);
  triggerFlash();
  store.capturePhoto(dataUrl); // auto increment index & handle max 6 di store

  if (store.session.photos.length === 6) {
    stopStream();
    store.goToPhotoReview();
  }
  // else: useEffect di atas otomatis re-trigger countdown untuk foto berikutnya
}
```

## 6. Retake Flow

- User di `PHOTO_REVIEW` atau `EDITING` klik `<RetakeButton slotIndex={n} />`.
- Store: `retakePhoto(n)` → set status kembali ke `CAMERA_PERMISSION` dengan flag `retakeSlotIndex = n`.
- `<CameraStage />` mendeteksi mode retake: skip counter "1/6" biasa, tampilkan "Retake photo N", setelah capture selesai langsung kembali ke `PHOTO_REVIEW` (bukan lanjut ke foto berikutnya).

## 7. Cleanup Checklist (WAJIB diverifikasi agent sebelum menandai fase Camera selesai)

- [ ] `MediaStream` displanplaystop pada: unmount `<CameraStage />`, transisi ke screen lain, klik "Start New".
- [ ] Tidak ada `setTimeout`/`setInterval` countdown yang masih berjalan setelah komponen unmount (clear di `useEffect` cleanup).
- [ ] `videoRef.current.srcObject = null` setelah stop, agar tidak memory leak referensi stream lama.
