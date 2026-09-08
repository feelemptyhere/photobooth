"use client";

import type { ThemeColor } from "@/types";
import { CircularSwatch } from "@/components/ui/CircularSwatch";
import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";

/** ThemeColor → display hex. Add a color = add one entry here + the type. */
const THEME_HEX: Record<ThemeColor, string> = {
  pink: "#E8A0A8",
  blue: "#4A90E2",
};

const OPTIONS: ThemeColor[] = ["pink", "blue"];

export function ThemePicker() {
  const selected = usePhotoBoothStore((s) => s.session.themeColor);
  const setThemeColor = usePhotoBoothStore((s) => s.setThemeColor);

  return (
    <div className="w-full">
      <p className="editorial-wide mb-4 text-[10px] text-[var(--muted)]">
        pick a theme
      </p>
      <div className="flex items-center gap-4">
        {OPTIONS.map((color) => (
          <CircularSwatch
            key={color}
            color={THEME_HEX[color]}
            selected={selected === color}
            onClick={() => setThemeColor(color)}
            label={color}
          />
        ))}
      </div>
    </div>
  );
}
