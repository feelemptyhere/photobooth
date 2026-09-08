"use client";

import type { CameraErrorType } from "@/lib/camera/useCamera";
import { Button } from "@/components/ui/Button";

interface CameraErrorStateProps {
  errorType: CameraErrorType;
  onRetry: () => void;
}

/** docs/08-CAMERA-MODULE.md §2 — human-friendly messages, no raw JS errors. */
const ERROR_COPY: Record<
  Exclude<CameraErrorType, null>,
  { message: string; retry: boolean }
> = {
  permission_denied: {
    message: "We need access to your camera to take your photos.",
    retry: true,
  },
  not_found: {
    message: "We couldn't find a camera on this device.",
    retry: true,
  },
  not_supported: {
    message: "Your browser doesn't support camera access. Try a different browser.",
    retry: false,
  },
  stream_failure: {
    message: "Something went wrong starting your camera.",
    retry: true,
  },
};

export function CameraErrorState({ errorType, onRetry }: CameraErrorStateProps) {
  if (!errorType) return null;
  const copy = ERROR_COPY[errorType];

  return (
    <div className="flex min-h-[60dvh] w-full flex-col items-center justify-center px-6 text-center">
      <p className="editorial-wide mb-4 text-[10px] text-[var(--muted)]">
        camera error
      </p>
      <p className="max-w-sm text-sm text-ink">{copy.message}</p>
      {copy.retry && (
        <Button variant="primary" className="mt-8" onClick={onRetry}>
          try again
        </Button>
      )}
    </div>
  );
}
