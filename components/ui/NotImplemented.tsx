import { SessionStatus } from "@/types";
import { Heading } from "./Heading";

const PHASE_LABEL: Partial<Record<SessionStatus, string>> = {
  camera_permission: "Fase 2 — Camera & Photo Capture",
  countdown: "Fase 2 — Countdown",
  capture: "Fase 2 — Capture",
  photo_review: "Fase 3 — Photo Review",
  editing: "Fase 3 — Photo Editor",
  strip_composition: "Fase 5 — Strip Composition",
  sticker_draw_editor: "Fase 6 — Stickers & Draw",
  final_result: "Fase 7 — Final Result",
  share: "Fase 8 — Share",
};

interface NotImplementedProps {
  status: SessionStatus;
}

/**
 * Placeholder for screens built in later phases. Keeps <AppShell />'s
 * switch total and the dev server error-free during phased rollout.
 */
export function NotImplemented({ status }: NotImplementedProps) {
  return (
    <div className="flex min-h-[80dvh] w-full flex-col items-center justify-center px-6 text-center">
      <p className="editorial-wide mb-6 text-[10px] text-[var(--muted)]">
        coming next
      </p>
      <Heading level={2}>{PHASE_LABEL[status] ?? status}</Heading>
      <p className="mt-4 max-w-sm text-sm text-[var(--muted)]">
        This screen is implemented in a later phase per the task breakdown.
      </p>
    </div>
  );
}
