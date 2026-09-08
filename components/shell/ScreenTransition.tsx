"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface ScreenTransitionProps {
  /** Unique key per screen — changing it triggers the exit/enter animation. */
  screenKey: string;
  children: ReactNode;
}

/**
 * Crossfade + slight vertical slide between screens.
 * `mode="wait"` ensures the exiting screen fully leaves before the next
 * mounts, so Framer Motion never renders two screens at once.
 */
export function ScreenTransition({ screenKey, children }: ScreenTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-[100dvh] w-full flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
