"use client";

import { Heading } from "@/components/ui/Heading";
import { ScreenFooter } from "@/components/ui/ScreenFooter";
import { StripLayoutCard } from "./StripLayoutCard";
import { stripLayouts } from "@/lib/templates/stripLayouts";
import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";

/**
 * Screen 02 — STRIP_SELECTION (docs/04-SCREENS-SPEC.md).
 * Choose strip layout → next validates stripLayoutId !== null.
 */
export function StripLayoutSelector() {
  const selectedId = usePhotoBoothStore((s) => s.session.stripLayoutId);
  const setStripLayout = usePhotoBoothStore((s) => s.setStripLayout);
  const goToPackSelection = usePhotoBoothStore((s) => s.goToPackSelection);
  const goBack = usePhotoBoothStore((s) => s.goBack);

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-1 flex-col px-6 py-12 lg:py-16">
      <p className="editorial-wide mb-3 text-[10px] text-[var(--muted)]">
        step 02 — strip
      </p>
      <Heading level={1} className="mb-10 lg:mb-12">
        choose your strip
      </Heading>

      <div className="flex flex-1 flex-wrap items-center justify-center gap-6 lg:gap-10">
        {stripLayouts.map((layout) => (
          <StripLayoutCard
            key={layout.id}
            layout={layout}
            selected={selectedId === layout.id}
            onSelect={() => setStripLayout(layout.id)}
          />
        ))}
      </div>

      <ScreenFooter
        onBack={() => goBack("setup")}
        onNext={goToPackSelection}
        nextDisabled={selectedId === null}
      />
    </section>
  );
}
