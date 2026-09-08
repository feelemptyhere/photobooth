"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useCountdown — docs/08-CAMERA-MODULE.md §4.
 *
 * Counts down `from` → 0, calling `onComplete()` when it hits zero. Each step
 * waits `stepMs`. Enhancements over the spec baseline required by checklist §7:
 *   - `onComplete` is stored in a ref so `start` stays stable (no effect loops).
 *   - The pending timer is cleared on unmount (no leaked setTimeout).
 */
export function useCountdown(onComplete: () => void, from = 3, stepMs = 800) {
  const [count, setCount] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clear();
    let current = from;
    setCount(current);

    const tick = () => {
      current -= 1;
      if (current <= 0) {
        setCount(null);
        timerRef.current = null;
        onCompleteRef.current();
        return;
      }
      setCount(current);
      timerRef.current = setTimeout(tick, stepMs);
    };

    timerRef.current = setTimeout(tick, stepMs);
  }, [from, stepMs, clear]);

  // Clear any pending timer when the component unmounts (checklist §7).
  useEffect(() => () => clear(), [clear]);

  return { count, start, clear };
}
