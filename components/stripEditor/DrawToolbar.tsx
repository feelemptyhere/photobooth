"use client";

interface DrawToolbarProps {
  active: boolean;
  color: string;
  thickness: number;
  onToggleActive: () => void;
  onColorChange: (c: string) => void;
  onThicknessChange: (t: number) => void;
  onErase: () => void;
  onClearAll: () => void;
}

const COLORS = ["#1A1A1A", "#E8556E", "#4A90E2", "#FFC93C", "#5BAE5B"];
const THICKNESS = [2, 5, 10];

/**
 * <DrawToolbar /> — drawing controls (docs/05 §DrawToolbar).
 *
 * Implementation note: the spec lists an `onErase` prop. Rather than a pixel
 * eraser (strokes are vector data, not a raster layer), erase here = undo last
 * stroke (remove the most recent DrawingStroke). `onClearAll` wipes all strokes.
 * The `active`/`onToggleActive` pair toggles draw mode on/off (so the user can
 * return to manipulating stickers) — a small extension to the documented props.
 */
export function DrawToolbar({
  active,
  color,
  thickness,
  onToggleActive,
  onColorChange,
  onThicknessChange,
  onErase,
  onClearAll,
}: DrawToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="editorial-wide w-16 shrink-0 text-[8px] uppercase text-[var(--muted)]">
          color
        </span>
        <div className="flex gap-2">
          {COLORS.map((c) => {
            const selected = c === color;
            return (
              <button
                key={c}
                type="button"
                onClick={() => onColorChange(c)}
                className="h-6 w-6 rounded-full transition"
                style={{
                  backgroundColor: c,
                  boxShadow: selected
                    ? "0 0 0 2px var(--paper), 0 0 0 4px var(--ink)"
                    : "0 0 0 1px rgba(0,0,0,0.15)",
                }}
                aria-label={`color ${c}`}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="editorial-wide w-16 shrink-0 text-[8px] uppercase text-[var(--muted)]">
          size
        </span>
        <div className="flex items-center gap-2">
          {THICKNESS.map((t) => {
            const selected = t === thickness;
            return (
              <button
                key={t}
                type="button"
                onClick={() => onThicknessChange(t)}
                className="flex h-7 w-7 items-center justify-center rounded-full transition"
                style={{
                  backgroundColor: selected ? "rgba(0,0,0,0.08)" : "transparent",
                }}
                aria-label={`thickness ${t}`}
              >
                <span
                  className="block rounded-full bg-ink"
                  style={{ width: t + 2, height: t + 2 }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleActive}
          className="editorial rounded-full px-4 py-1.5 text-[10px] tracking-editorial transition"
          style={{
            backgroundColor: active ? "var(--ink)" : "rgba(0,0,0,0.05)",
            color: active ? "var(--paper)" : "var(--ink)",
          }}
        >
          {active ? "drawing on" : "start draw"}
        </button>
        <button
          type="button"
          onClick={onErase}
          className="editorial rounded-full bg-ink/5 px-4 py-1.5 text-[10px] tracking-editorial text-ink/70 transition hover:bg-ink/10"
        >
          undo stroke
        </button>
        <button
          type="button"
          onClick={onClearAll}
          className="editorial rounded-full bg-ink/5 px-4 py-1.5 text-[10px] tracking-editorial text-ink/70 transition hover:bg-ink/10"
        >
          clear all
        </button>
      </div>
    </div>
  );
}
