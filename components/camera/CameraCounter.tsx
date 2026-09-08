"use client";

interface CameraCounterProps {
  index: number; // 0-based current slot
  total: number;
}

/**
 * "PHOTO n / total" editorial counter in the corner of the camera viewport.
 * index is 0-based internally but shown 1-based to the user.
 */
export function CameraCounter({ index, total }: CameraCounterProps) {
  return (
    <div className="absolute left-0 top-0 flex items-center gap-2 p-4">
      <span className="editorial-wide text-[10px] text-paper/90 drop-shadow">
        photo {index + 1} / {total}
      </span>
    </div>
  );
}
