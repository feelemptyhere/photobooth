"use client";

import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { NameInput } from "./NameInput";
import { ThemePicker } from "./ThemePicker";
import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";

/**
 * Screen 01 — SETUP (docs/04-SCREENS-SPEC.md).
 * Name input + theme picker → "ready ▷" advances to STRIP_SELECTION.
 */
export function SetupScreen() {
  const name = usePhotoBoothStore((s) => s.session.name);
  const themeColor = usePhotoBoothStore((s) => s.session.themeColor);
  const goToStripSelection = usePhotoBoothStore((s) => s.goToStripSelection);

  const ready = name.trim().length > 0 && themeColor !== null;

  return (
    <section className="mx-auto flex min-h-[100dvh] w-full max-w-xl flex-1 flex-col justify-center px-6 py-16">
      <p className="editorial-wide mb-3 text-[10px] text-[var(--muted)]">
        step 01 — setup
      </p>
      <Heading level={1} className="mb-12">
        let&apos;s make a strip
      </Heading>

      <div className="flex flex-col gap-12">
        <NameInput />
        <ThemePicker />
      </div>

      <div className="mt-14 flex justify-end">
        <Button variant="primary" onClick={goToStripSelection} disabled={!ready}>
          ready ▷
        </Button>
      </div>
    </section>
  );
}
