"use client";

import { create } from "zustand";
import type {
  CapturedPhoto,
  DrawingStroke,
  PhotoBoothSession,
  PlacedSticker,
  SessionStatus,
  ThemeColor,
} from "@/types";

export const SESSION_MAX_PHOTOS = 6;

// Zustand store — contract: docs/03-STATE-MACHINE.md §3.
// status (top-level, read by <AppShell/>) is mirrored into session.status
// via transition() so the two never drift. Each goTo* validates the previous
// state's exit condition (no-op + dev warn when invalid).
const createEmptySession = (): PhotoBoothSession => ({
  name: "",
  themeColor: null,
  stripLayoutId: null,
  packId: null,
  currentPhotoIndex: 0,
  photos: [],
  stickers: [],
  drawings: [],
  finalImageDataUrl: null,
  status: "setup", // land on SETUP; IDLE is a transient pre-state only
});

const isDev = process.env.NODE_ENV !== "production";
const warn = (m: string) => {
  if (isDev) console.warn(`[photoBoothStore] transition blocked: ${m}`);
};

export interface PhotoBoothStore {
  session: PhotoBoothSession;
  status: SessionStatus;
  /** Transient retake flag (orchestration only, NOT part of the session data
   *  model). When non-null, capturePhoto() does a single shot and returns to
   *  PHOTO_REVIEW instead of continuing the 6-shot loop (docs/08 §6). */
  retakeSlotIndex: number | null;
  setName: (name: string) => void;
  setThemeColor: (color: ThemeColor) => void;
  goToStripSelection: () => void;
  setStripLayout: (id: string) => void;
  goToPackSelection: () => void;
  setPack: (id: string) => void;
  goToCamera: () => void;
  startCountdown: () => void;
  capturePhoto: (dataUrl: string) => void;
  retakePhoto: (slotIndex: number) => void;
  goToEditing: () => void;
  updatePhotoEdit: (slotIndex: number, patch: Partial<CapturedPhoto>) => void;
  goToStripComposition: () => void;
  goToStickerDrawEditor: () => void;
  addSticker: (sticker: PlacedSticker) => void;
  updateSticker: (id: string, patch: Partial<PlacedSticker>) => void;
  removeSticker: (id: string) => void;
  addDrawingStroke: (stroke: DrawingStroke) => void;
  clearDrawings: () => void;
  finalizeStrip: (dataUrl: string) => void;
  resetSession: () => void;
  // Additive convenience for linear back-navigation (setup↔strip↔pack).
  // No re-validation — back is always user-driven and safe.
  goBack: (to: SessionStatus) => void;
}

export const usePhotoBoothStore = create<PhotoBoothStore>((set, get) => {
  const transition = (next: SessionStatus, patch: Partial<PhotoBoothSession> = {}) =>
    set((s) => ({ status: next, session: { ...s.session, ...patch, status: next } }));

  return {
    session: createEmptySession(),
    status: "setup",
    retakeSlotIndex: null,
    setName: (name) => set((s) => ({ session: { ...s.session, name } })),
    setThemeColor: (themeColor) => set((s) => ({ session: { ...s.session, themeColor } })),
    // Exit SETUP: name.trim() && themeColor !== null
    goToStripSelection: () => {
      const { session } = get();
      if (!session.name.trim() || session.themeColor === null) {
        warn("SETUP exit requires name + themeColor");
        return;
      }
      transition("strip_selection");
    },
    setStripLayout: (stripLayoutId) => set((s) => ({ session: { ...s.session, stripLayoutId } })),
    goToPackSelection: () => {
      if (get().session.stripLayoutId === null) { warn("STRIP_SELECTION exit requires stripLayoutId"); return; }
      transition("pack_selection");
    },
    setPack: (packId) => set((s) => ({ session: { ...s.session, packId } })),
    goToCamera: () => {
      if (get().session.packId === null) { warn("PACK_SELECTION exit requires packId"); return; }
      set((s) => ({ retakeSlotIndex: null, status: "camera_permission", session: { ...s.session, currentPhotoIndex: 0, photos: [], status: "camera_permission" } }));
    },
    startCountdown: () => {
      const st = get().status;
      if (st !== "camera_permission" && st !== "capture") { warn("startCountdown only from camera_permission/capture"); return; }
      transition("countdown");
    },
    capturePhoto: (dataUrl) => {
      const { session, retakeSlotIndex } = get();
      const idx = session.currentPhotoIndex;
      const isRetake = retakeSlotIndex !== null;
      const photo: CapturedPhoto = {
        id: `${Date.now()}-${idx}`,
        slotIndex: idx,
        imageDataUrl: dataUrl,
        backgroundId: null,
        filterId: "original",
        effectId: null,
        retaken: isRetake,
      };
      const photos = [...session.photos];
      photos[idx] = photo;
      if (isRetake) {
        // Single retake shot — return to PHOTO_REVIEW, do not advance the loop.
        set((s) => ({
          status: "photo_review",
          retakeSlotIndex: null,
          session: { ...s.session, photos, currentPhotoIndex: 0, status: "photo_review" },
        }));
      } else if (idx < SESSION_MAX_PHOTOS - 1) {
        set((s) => ({ status: "countdown", session: { ...s.session, photos, currentPhotoIndex: idx + 1, status: "countdown" } }));
      } else {
        set((s) => ({ status: "photo_review", session: { ...s.session, photos, currentPhotoIndex: 0, status: "photo_review" } }));
      }
    },
    retakePhoto: (slotIndex) => {
      if (slotIndex < 0 || slotIndex >= SESSION_MAX_PHOTOS) { warn(`invalid slotIndex ${slotIndex}`); return; }
      set((s) => ({
        retakeSlotIndex: slotIndex,
        status: "camera_permission",
        session: { ...s.session, currentPhotoIndex: slotIndex, status: "camera_permission" },
      }));
    },
    goToEditing: () => transition("editing"),
    updatePhotoEdit: (slotIndex, patch) =>
      set((s) => {
        const photos = [...s.session.photos];
        if (!photos[slotIndex]) { warn(`no photo at slot ${slotIndex}`); return {}; }
        photos[slotIndex] = { ...photos[slotIndex], ...patch };
        return { session: { ...s.session, photos } };
      }),
    goToStripComposition: () => transition("strip_composition"),
    goToStickerDrawEditor: () => transition("sticker_draw_editor"),
    addSticker: (sticker) => set((s) => ({ session: { ...s.session, stickers: [...s.session.stickers, sticker] } })),
    updateSticker: (id, patch) => set((s) => ({ session: { ...s.session, stickers: s.session.stickers.map((st) => (st.id === id ? { ...st, ...patch } : st)) } })),
    removeSticker: (id) => set((s) => ({ session: { ...s.session, stickers: s.session.stickers.filter((st) => st.id !== id) } })),
    addDrawingStroke: (stroke) => set((s) => ({ session: { ...s.session, drawings: [...s.session.drawings, stroke] } })),
    clearDrawings: () => set((s) => ({ session: { ...s.session, drawings: [] } })),
    finalizeStrip: (dataUrl) => transition("final_result", { finalImageDataUrl: dataUrl }),
    resetSession: () => set({ session: createEmptySession(), status: "setup", retakeSlotIndex: null }),
    goBack: (to) => transition(to),
  };
});
