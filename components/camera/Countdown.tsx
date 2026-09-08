"use client";

import { AnimatePresence, motion } from "framer-motion";

interface CountdownProps {
  /** 3..1 while counting; null when idle/complete. */
  count: number | null;
}

/**
 * Big editorial countdown number overlaid on the camera viewport.
 */
export function Countdown({ count }: CountdownProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {count !== null && (
          <motion.span
            key={count}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="editorial text-[120px] font-light leading-none text-paper drop-shadow-lg"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
