"use client";

/**
 * <AppShell /> — top-level orchestrator (docs/05-COMPONENT-ARCHITECTURE.md).
 *
 * Reads `status` from the photoBoothStore and renders the matching screen,
 * wrapped in <ScreenTransition /> for the crossfade/vertical-slide animation.
 * Renders nothing else — no navbar, no sidebar (PRD §4 minimal shell).
 *
 * Screens for later phases fall back to <NotImplemented /> so the dev server
 * stays error-free during phased rollout.
 */
import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";
import type { SessionStatus } from "@/types";
import { ScreenTransition } from "./ScreenTransition";
import { SetupScreen } from "@/components/setup/SetupScreen";
import { StripLayoutSelector } from "@/components/strip/StripLayoutSelector";
import { PackSelector } from "@/components/pack/PackSelector";
import { NotImplemented } from "@/components/ui/NotImplemented";

const SCREENS: Partial<Record<SessionStatus, () => React.ReactNode>> = {
  setup: SetupScreen,
  strip_selection: StripLayoutSelector,
  pack_selection: PackSelector,
};

export default function AppShell() {
  const status = usePhotoBoothStore((s) => s.status);
  const Screen = SCREENS[status];

  return (
    <main className="min-h-[100dvh] w-full bg-paper dot-grid">
      <ScreenTransition screenKey={status}>
        {Screen ? <Screen /> : <NotImplemented status={status} />}
      </ScreenTransition>
    </main>
  );
}
