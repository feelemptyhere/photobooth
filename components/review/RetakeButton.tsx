"use client";

import { Button } from "@/components/ui/Button";

interface RetakeButtonProps {
  slotIndex: number;
  onRetake: (slotIndex: number) => void;
}

/**
 * Triggers a single-slot retake via store.retakePhoto(slotIndex), which sets
 * status back to CAMERA_PERMISSION with a retake flag so the capture loop
 * returns to PHOTO_REVIEW after one shot (docs/08 §6).
 */
export function RetakeButton({ slotIndex, onRetake }: RetakeButtonProps) {
  return (
    <Button variant="ghost" onClick={() => onRetake(slotIndex)}>
      ↺ retake
    </Button>
  );
}
