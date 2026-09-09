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
import { CameraStage } from "@/components/camera/CameraStage";
import { PhotoEditor } from "@/components/review/PhotoEditor";
import { StripCompositionScreen } from "@/components/strip/StripCompositionScreen";
import { StickerDrawEditor } from "@/components/stripEditor/StickerDrawEditor";
import { FinalPreview } from "@/components/final/FinalPreview";
import { NotImplemented } from "@/components/ui/NotImplemented";

const SCREENS: Partial<Record<SessionStatus, () => React.ReactNode>> = {
  setup: SetupScreen,
  strip_selection: StripLayoutSelector,
  pack_selection: PackSelector,
  // The three camera sub-statuses are all rendered by <CameraStage />.
  camera_permission: CameraStage,
  countdown: CameraStage,
  capture: CameraStage,
  // Screen 05 — per-photo filter/background/effect editing (status lands here
  // after the 6th capture, or after a single retake shot).
  photo_review: PhotoEditor,
  editing: PhotoEditor,
  // Screen 07 — live canvas strip preview (render engine host).
  strip_composition: StripCompositionScreen,
  // Screen 08 — stickers & freehand draw overlays on the live strip preview.
  sticker_draw_editor: StickerDrawEditor,
  // Screen 09 — final exported strip (download + start new; share = Fase 8).
  final_result: FinalPreview,
};

/**
 * Collapse the three camera sub-statuses into one screen key so the live
 * <video> + MediaStream stay mounted across the whole capture loop (remounting
 * would tear the stream down mid-countdown).
 */
function screenKeyFor(status: SessionStatus): string {
  if (
    status === "camera_permission" ||
    status === "countdown" ||
    status === "capture"
  ) {
    return "camera";
  }
  return status;
}

export default function AppShell() {
  const status = usePhotoBoothStore((s) => s.status);
  const Screen = SCREENS[status];

  return (
    <main className="min-h-[100dvh] w-full bg-paper dot-grid">
      <ScreenTransition screenKey={screenKeyFor(status)}>
        {Screen ? <Screen /> : <NotImplemented status={status} />}
      </ScreenTransition>
    </main>
  );
}
