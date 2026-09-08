/**
 * <AppShell /> — top-level orchestrator.
 *
 * Phase 0 (Project Bootstrap): renders a placeholder screen so `npm run dev`
 * runs without error. Real screen routing & Framer Motion transitions are
 * implemented in Phase 1 (UI Shell & Routing/State Flow) per
 * docs/09-TASK-BREAKDOWN.md.
 *
 * Contract (docs/05-COMPONENT-ARCHITECTURE.md) will be honored in Phase 1:
 *   - Reads status from photoBoothStore
 *   - Wraps active screen in <ScreenTransition />
 *   - Renders nothing else (no navbar, no sidebar — PRD §4)
 */
export default function AppShell() {
  return (
    <main className="min-h-[100dvh] w-full flex items-center justify-center bg-paper dot-grid">
      <div className="text-center px-6">
        <p className="editorial-wide text-[10px] text-[var(--muted)] mb-6">
          Photobooth
        </p>
        <h1 className="editorial text-2xl md:text-3xl text-ink">
          Project Bootstrap
        </h1>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Fase 0 berhasil. Fase 1 (UI Shell & Routing) belum diimplementasi.
        </p>
        <div className="mt-8 h-px w-16 bg-[var(--line)] mx-auto" />
      </div>
    </main>
  );
}