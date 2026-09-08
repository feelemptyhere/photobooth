"use client";

import { usePhotoBoothStore } from "@/lib/state/photoBoothStore";

export function NameInput() {
  const name = usePhotoBoothStore((s) => s.session.name);
  const setName = usePhotoBoothStore((s) => s.setName);

  return (
    <div className="w-full">
      <label
        htmlFor="photobooth-name"
        className="editorial-wide mb-3 block text-[10px] text-[var(--muted)]"
      >
        your name
      </label>
      <input
        id="photobooth-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={24}
        autoComplete="off"
        spellCheck={false}
        placeholder="type here"
        className="editorial w-full border-b border-[var(--line)] bg-transparent pb-3 text-2xl text-ink placeholder:text-[var(--muted)] focus:border-ink focus:outline-none"
      />
    </div>
  );
}
