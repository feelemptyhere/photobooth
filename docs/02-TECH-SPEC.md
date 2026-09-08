# Technical Specification

## 1. Struktur Folder (Next.js App Router)

```
/app
  /page.tsx                     → entry, render <AppShell />
  /layout.tsx
  /globals.css

/components
  /shell/AppShell.tsx
  /shell/ScreenTransition.tsx   → wrapper Framer Motion untuk transisi antar screen

  /setup/SetupScreen.tsx
  /setup/NameInput.tsx
  /setup/ThemePicker.tsx

  /strip/StripLayoutSelector.tsx
  /strip/StripLayoutCard.tsx

  /pack/PackSelector.tsx
  /pack/PackThumbnail.tsx

  /camera/CameraStage.tsx
  /camera/CameraCounter.tsx
  /camera/Countdown.tsx
  /camera/CameraErrorState.tsx
  /camera/CaptureFlash.tsx

  /effects/EffectCarousel.tsx
  /effects/BackgroundCarousel.tsx
  /effects/FilterCarousel.tsx
  /effects/CircleThumbButton.tsx

  /review/PhotoThumbnailStrip.tsx
  /review/PhotoEditor.tsx
  /review/RetakeButton.tsx

  /stripEditor/StripEditor.tsx        → orchestrator layar "Make Your Strip"
  /stripEditor/StripCanvasPreview.tsx → <canvas> live preview
  /stripEditor/StickerPicker.tsx
  /stripEditor/StickerLayer.tsx
  /stripEditor/DrawingCanvas.tsx
  /stripEditor/DrawToolbar.tsx

  /final/FinalPreview.tsx
  /final/ShareButton.tsx
  /final/DownloadButton.tsx

  /ui/Button.tsx
  /ui/Heading.tsx
  /ui/CircularSwatch.tsx

/lib
  /state/photoBoothStore.ts      → Zustand store (single source of truth)
  /state/stateMachine.ts         → definisi state & transisi
  /canvas/renderStrip.ts         → engine render final strip ke canvas
  /canvas/applyFilter.ts         → filter processing (CSS filter string / pixel manipulation)
  /canvas/compositeLayers.ts     → urutan layer compositing
  /camera/useCamera.ts           → hook getUserMedia + cleanup
  /camera/useCountdown.ts        → hook countdown 3-2-1
  /templates/stripPacks.ts       → data template pack (data-driven, lihat 06-TEMPLATE-SYSTEM.md)
  /templates/stripLayouts.ts     → data layout (1x4, 2x2, 1x3, dst)
  /assets/backgrounds.ts         → daftar background options (placeholder)
  /assets/filters.ts             → daftar filter definitions
  /assets/effects.ts             → daftar face effect overlays
  /assets/stickers.ts            → daftar stiker
  /utils/download.ts             → export PNG helper
  /utils/share.ts                → Web Share API + fallback
  /utils/date.ts                 → format tanggal YYYY . MM . DD

/public
  /assets/backgrounds/*.png
  /assets/effects/*.png
  /assets/stickers/*.png
  /assets/pack-textures/*.png

/types
  /index.ts                      → semua TypeScript interface (lihat bawah)
```

## 2. Data Model (TypeScript Interfaces)

```typescript
// types/index.ts

export type ThemeColor = 'pink' | 'blue';

export interface PhotoBoothSession {
  name: string;
  themeColor: ThemeColor | null;
  stripLayoutId: string | null;      // ref ke StripLayout.id
  packId: string | null;             // ref ke StripPack.id
  currentPhotoIndex: number;         // 0-5 selama capture
  photos: CapturedPhoto[];           // max 6, index tetap
  stickers: PlacedSticker[];
  drawings: DrawingStroke[];
  finalImageDataUrl: string | null;
  status: SessionStatus;
}

export type SessionStatus =
  | 'idle' | 'setup' | 'strip_selection' | 'pack_selection'
  | 'camera_permission' | 'countdown' | 'capture' | 'photo_review'
  | 'editing' | 'strip_composition' | 'sticker_draw_editor'
  | 'final_result' | 'share' | 'reset';

export interface CapturedPhoto {
  id: string;                 // uuid
  slotIndex: number;          // 0-5
  imageDataUrl: string;       // hasil capture mentah (base64)
  backgroundId: string | null;
  filterId: string;           // default: 'original'
  effectId: string | null;
  retaken: boolean;
}

export interface StripLayout {
  id: string;                 // '1x4' | '2x2' | '1x3'
  name: string;
  slotCount: number;
  gridPreview: string;        // ascii/svg key untuk render pilihan
}

export interface StripPack {
  id: string;
  name: string;
  width: number;              // px, di resolusi preview (mis. 300)
  height: number;
  background: string;         // warna hex / gradient css
  textureUrl?: string;        // opsional pattern/texture image
  photoSlots: PhotoSlotDef[];
  decorativeElements: DecorativeElement[];
  typography: {
    fontFamily: string;
    footerColor: string;
  };
  footer: {
    showDate: boolean;
    brandText: string;
  };
}

export interface PhotoSlotDef {
  index: number;               // urutan foto ke berapa masuk slot ini
  x: number; y: number;        // posisi relatif dalam strip (px pada base width/height)
  width: number; height: number;
  rotation?: number;           // derajat, opsional untuk polaroid-style
  fit: 'cover' | 'contain';
}

export interface DecorativeElement {
  id: string;
  imageUrl: string;
  x: number; y: number;
  width: number; height: number;
  zIndex: number;              // relatif terhadap photoSlots (di atas/bawah foto)
}

export interface PlacedSticker {
  id: string;
  stickerAssetId: string;
  x: number; y: number;        // posisi di kanvas strip (koordinat base resolution)
  scale: number;
  rotation: number;
}

export interface DrawingStroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  thickness: number;
}

export interface FilterDef {
  id: string;
  name: string;
  cssFilter: string;           // contoh: 'grayscale(1) contrast(1.1)'
}

export interface BackgroundOption {
  id: string;
  name: string;
  thumbnailUrl: string;
  type: 'none' | 'color' | 'image';
  value: string;                // hex color atau image url
}

export interface EffectOption {
  id: string;
  name: string;
  thumbnailUrl: string;
  overlayImageUrl: string;
  anchor: 'face-top' | 'face-center' | 'full-frame';
}

export interface StickerAsset {
  id: string;
  name: string;
  category: 'hearts' | 'stars' | 'flowers' | 'characters' | 'bows' | 'sparkles' | 'food' | 'animals' | 'shapes';
  imageUrl: string;
}
```

## 3. Resolusi & Export

- Preview strip di layar: base **300 × 1200 px** (rasio disesuaikan jumlah slot).
- Export final: **3x resolusi preview** → **900 × 3600 px**, format PNG.
- Semua koordinat di `StripPack` didefinisikan pada base resolution (300×1200), lalu di-scale saat render ke canvas export (`scaleFactor = exportWidth / baseWidth`).

## 4. Kompatibilitas Browser

- Wajib: Chrome, Safari (desktop & iOS), Edge terbaru.
- `getUserMedia` butuh HTTPS (atau localhost saat dev).
- `navigator.share()` dicek dengan `canShare()` dulu sebelum dipanggil; jika tidak ada/gagal, fallback ke `<DownloadButton />` + pesan teks.

## 5. Non-Functional Requirements

- Tidak ada network request untuk data foto (privacy).
- Tidak ada re-render berlebihan: gunakan Zustand selector granular, `React.memo` pada komponen thumbnail list.
- Cleanup wajib: `MediaStream.getTracks().forEach(t => t.stop())` saat unmount CameraStage atau saat klik "Start New".
- Cleanup `URL.revokeObjectURL()` untuk setiap object URL yang dibuat.
