"use client";

import { AnimatePresence, motion } from "framer-motion";

interface CaptureFlashProps {
  active: boolean;
}

/**
 * Brief white flash overlay fired the instant a frame is captured,
 * simulating a camera shutter. Purely visual.
 */
export function CaptureFlash({ active }: CaptureFlashProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0.95 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 bg-white"
        />
      )}
    </AnimatePresence>
  );
}
