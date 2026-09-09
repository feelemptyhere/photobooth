/**
 * Footer date formatter (docs/07-CANVAS-RENDER-ENGINE.md §3.5).
 * Output: "2026 . 09 . 08" (dot-spaced, zero-padded).
 */
export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y} . ${m} . ${day}`;
}
