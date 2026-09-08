"use client";

import { Button } from "./Button";

interface ScreenFooterProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
}

/**
 * Shared back/next navigation footer for sequential selection screens
 * (Strip layout, Pack selection, etc.). Thin hairline divider above.
 */
export function ScreenFooter({
  onBack,
  onNext,
  nextLabel = "next ▷",
  backLabel = "back",
  nextDisabled = false,
}: ScreenFooterProps) {
  return (
    <footer className="mt-auto">
      <div className="h-px w-full bg-[var(--line)]" />
      <div className="flex items-center justify-between py-5">
        {onBack ? (
          <Button variant="ghost" onClick={onBack}>
            {backLabel}
          </Button>
        ) : (
          <span />
        )}
        {onNext && (
          <Button variant="primary" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </Button>
        )}
      </div>
    </footer>
  );
}
