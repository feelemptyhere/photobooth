"use client";

import { useState } from "react";
import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";
import { filters, getFilterCss } from "@/lib/assets/filters";
import { backgrounds, getBackground } from "@/lib/assets/backgrounds";
import { effects, getEffect } from "@/lib/assets/effects";
import { Heading } from "@/components/ui/Heading";
import { ScreenFooter } from "@/components/ui/ScreenFooter";
import { FilterCarousel } from "@/components/effects/FilterCarousel";
import { BackgroundCarousel } from "@/components/effects/BackgroundCarousel";
import { EffectCarousel } from "@/components/effects/EffectCarousel";
import { PhotoThumbnailStrip } from "./PhotoThumbnailStrip";
import { RetakeButton } from "./RetakeButton";

/**
 * PhotoEditor (Screen 05) — review + per-photo editing.
 * Big preview shows the active photo with its filter/background/effect applied
 * live (pure CSS for the preview; the canvas engine in Fase 5 will bake these
 * into the final strip). `activeIndex` is local UI state (transient, not part
 * of the session data model).
 */
export function PhotoEditor() {
  const photos = usePhotoBoothStore((s) => s.session.photos);
  const updatePhotoEdit = usePhotoBoothStore((s) => s.updatePhotoEdit);
  const retakePhoto = usePhotoBoothStore((s) => s.retakePhoto);
  const goToStripComposition = usePhotoBoothStore((s) => s.goToStripComposition);
  const goBack = usePhotoBoothStore((s) => s.goBack);

  const [active, setActive] = useState(0);
  const photo = photos[active];

  if (!photo) {
    return (
      <section className="mx-auto flex min-h-[60dvh] w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
        <p className="editorial-wide text-[10px] text-[var(--muted)]">
          no photos yet
        </p>
      </section>
    );
  }

  const bg = getBackground(photo.backgroundId);
  const effect = getEffect(photo.effectId);
  const bgValue =
    bg?.type === "color" || bg?.type === "image" ? bg.value : "transparent";

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-1 flex-col px-6 py-8">
      <Heading level={2} className="mb-6 text-center">
        edit your photos
      </Heading>

      {/* Live preview — background frame + photo (CSS filter) + effect overlay */}
      <div className="flex flex-col items-center">
        <div
          className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl"
          style={{ backgroundColor: bgValue }}
        >
          <img
            src={photo.imageDataUrl}
            alt="active photo"
            className="h-full w-full object-cover"
            style={{ filter: getFilterCss(photo.filterId) }}
          />
          {effect && (
            <img
              src={effect.overlayImageUrl}
              alt={effect.name}
              className="pointer-events-none absolute left-1/2 w-[70%] -translate-x-1/2"
              style={{
                top:
                  effect.anchor === "face-top"
                    ? "2%"
                    : effect.anchor === "face-center"
                      ? "28%"
                      : "0",
              }}
            />
          )}
        </div>

        <div className="mt-4">
          <RetakeButton slotIndex={active} onRetake={retakePhoto} />
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="mt-6">
        <PhotoThumbnailStrip
          photos={photos}
          activeIndex={active}
          onSelect={setActive}
        />
      </div>

      {/* Per-photo carousels */}
      <div className="mt-8 flex flex-col gap-6">
        <BackgroundCarousel
          options={backgrounds}
          selectedId={photo.backgroundId}
          onSelect={(id) => updatePhotoEdit(active, { backgroundId: id })}
        />
        <FilterCarousel
          options={filters}
          selectedId={photo.filterId}
          onSelect={(id) => updatePhotoEdit(active, { filterId: id })}
        />
        <EffectCarousel
          options={effects}
          selectedId={photo.effectId}
          onSelect={(id) =>
            updatePhotoEdit(active, {
              effectId: id === photo.effectId ? null : id,
            })
          }
        />
      </div>

      <ScreenFooter
        onBack={() => goBack("pack_selection")}
        onNext={goToStripComposition}
        nextLabel="next ▷"
      />
    </section>
  );
}
