"use client";

import { Heading } from "@/components/ui/Heading";
import { ScreenFooter } from "@/components/ui/ScreenFooter";
import { PackThumbnail } from "./PackThumbnail";
import { stripPacks } from "@/lib/templates/stripPacks";
import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";

/**
 * Screen 03 — PACK_SELECTION (docs/04-SCREENS-SPEC.md).
 * Pick a color theme pack → next validates packId !== null then hands off to
 * CAMERA_PERMISSION (Fase 2 placeholder until the camera module is built).
 */
export function PackSelector() {
  const selectedId = usePhotoBoothStore((s) => s.session.packId);
  const setPack = usePhotoBoothStore((s) => s.setPack);
  const goToCamera = usePhotoBoothStore((s) => s.goToCamera);
  const goBack = usePhotoBoothStore((s) => s.goBack);

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-1 flex-col px-6 py-12 lg:py-16">
      <p className="editorial-wide mb-3 text-[10px] text-[var(--muted)]">
        step 03 — color themes
      </p>
      <Heading level={1} className="mb-2">
        pick a pack
      </Heading>
      <p className="editorial-wide mb-10 text-[10px] text-[var(--muted)] lg:mb-12">
        △ sets the strip background &amp; footer
      </p>

      <div className="flex flex-1 flex-wrap items-center justify-center gap-6 lg:gap-8">
        {stripPacks.map((pack) => (
          <PackThumbnail
            key={pack.id}
            pack={pack}
            selected={selectedId === pack.id}
            onSelect={() => setPack(pack.id)}
          />
        ))}
      </div>

      <ScreenFooter
        onBack={() => goBack("strip_selection")}
        onNext={goToCamera}
        nextDisabled={selectedId === null}
        nextLabel="start camera ▷"
      />
    </section>
  );
}
