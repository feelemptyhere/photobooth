"use client";

import type { StripLayout } from "@/types";

interface StripLayoutCardProps {
  layout: StripLayout;
  selected: boolean;
  onSelect: () => void;
}

/** Parse "col-{c}-row-{r}" → grid dims; falls back to 1×slotCount. */
function parseGrid(grid: string, fallbackSlots: number) {
  const m = grid.match(/col-(\d+)-row-(\d+)/);
  return m ? { cols: +m[1], rows: +m[2] } : { cols: 1, rows: fallbackSlots };
}

/**
 * Thumbnail preview of a strip layout rendered as an SVG grid of slot cells.
 * Selected state = darker border + slight scale-up (PRD §4 thumbnail controls).
 */
export function StripLayoutCard({ layout, selected, onSelect }: StripLayoutCardProps) {
  const { cols, rows } = parseGrid(layout.gridPreview, layout.slotCount);
  const w = 88;
  const h = 140;
  const pad = 6;
  const gap = 4;
  const cellW = (w - pad * 2 - gap * (cols - 1)) / cols;
  const cellH = (h - pad * 2 - gap * (rows - 1)) / rows;

  const cells: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        x: pad + c * (cellW + gap),
        y: pad + r * (cellH + gap),
      });
    }
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group flex flex-col items-center gap-3 focus:outline-none"
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="transition-transform duration-200"
        style={{ transform: selected ? "scale(1.05)" : "scale(1)" }}
      >
        <rect
          x={0}
          y={0}
          width={w}
          height={h}
          rx={6}
          fill="var(--paper)"
          stroke={selected ? "var(--ink)" : "var(--line)"}
          strokeWidth={selected ? 1.5 : 1}
        />
        {cells.map((cell, i) => (
          <rect
            key={i}
            x={cell.x}
            y={cell.y}
            width={cellW}
            height={cellH}
            rx={2}
            fill="var(--line)"
          />
        ))}
      </svg>
      <span
        className={`editorial text-[10px] transition-colors ${
          selected ? "text-ink" : "text-[var(--muted)]"
        }`}
      >
        {layout.name}
      </span>
    </button>
  );
}
