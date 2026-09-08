/**
 * Strip layout options — data-driven (docs/06-TEMPLATE-SYSTEM.md §1).
 *
 * The camera ALWAYS captures 6 photos. Layouts with `slotCount < 6` mean only
 * a subset of the 6 photos is placed on the strip (the `1x6` layout is the
 * default that uses all 6). This is resolved at strip-composition time
 * (Fase 5), not here.
 */
import type { StripLayout } from "@/types";

export const stripLayouts: StripLayout[] = [
  {
    id: "1x6",
    name: "1 × 6",
    slotCount: 6,
    gridPreview: "col-1-row-6",
  },
  {
    id: "1x4",
    name: "1 × 4",
    slotCount: 4,
    gridPreview: "col-1-row-4",
  },
  {
    id: "2x2",
    name: "2 × 2",
    slotCount: 4,
    gridPreview: "col-2-row-2",
  },
  {
    id: "1x3",
    name: "1 × 3",
    slotCount: 3,
    gridPreview: "col-1-row-3",
  },
];
