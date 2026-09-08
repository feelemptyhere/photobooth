# Component Architecture

Daftar komponen wajib beserta props kontrak dan tanggung jawab. Agent harus mengimplementasikan sesuai kontrak ini agar antar komponen konsisten.

## Shell

### `<AppShell />`
- Tidak menerima props (root component).
- Membaca `status` dari store, me-render screen yang sesuai lewat switch/mapping.
- Membungkus semua screen dengan `<ScreenTransition />`.

### `<ScreenTransition />`
- Props: `{ children: ReactNode, screenKey: string }`
- Menggunakan Framer Motion `AnimatePresence` + `motion.div` untuk fade/slide antar screen berdasarkan `screenKey` (biasanya = `status`).

## Setup

### `<SetupScreen />`
- Tidak ada props (ambil dari store langsung).
- Compose: `<NameInput />`, `<ThemePicker />`, `<Button>ready ▷</Button>`.

### `<NameInput />`
- Props: `{ value: string, onChange: (v: string) => void }`

### `<ThemePicker />`
- Props: `{ options: ThemeColor[], selected: ThemeColor | null, onSelect: (c: ThemeColor) => void }`

## Strip Layout

### `<StripLayoutSelector />`
- Ambil `StripLayout[]` dari `lib/templates/stripLayouts.ts`.
- Render list `<StripLayoutCard />`.

### `<StripLayoutCard />`
- Props: `{ layout: StripLayout, selected: boolean, onSelect: () => void }`
- Render preview grid SVG sesuai `layout.slotCount`.

## Pack Selection

### `<PackSelector />`
- Ambil `StripPack[]` dari `lib/templates/stripPacks.ts`.
- Render list `<PackThumbnail />`.

### `<PackThumbnail />`
- Props: `{ pack: StripPack, selected: boolean, onSelect: () => void }`
- Render miniatur strip (canvas kecil atau div ber-background sesuai `pack.background`/`pack.textureUrl` + placeholder slot).

## Camera

### `<CameraStage />`
- Tidak ada props; orchestrator utama Screen 04.
- Menggunakan hook `useCamera()` dan `useCountdown()`.
- Compose: `<video>` element, `<CameraCounter />`, `<Countdown />`, `<CaptureFlash />`, `<BackgroundCarousel />`, `<FilterCarousel />`, `<EffectCarousel />`, `<CameraErrorState />` (conditional).

### `useCamera()` (hook, bukan komponen)
- Return: `{ videoRef, stream, error, requestPermission, stopStream }`
- Wajib cleanup `stream` di `useEffect` return function.

### `useCountdown(onComplete: () => void)` (hook)
- Return: `{ count: number | null, start: () => void }`

### `<CameraCounter />`
- Props: `{ current: number, total: number }` → render `${current} / ${total}`.

### `<Countdown />`
- Props: `{ count: number | null }` — render angka besar dengan animasi, `null` = tidak render apapun.

### `<CaptureFlash />`
- Props: `{ trigger: boolean }` — trigger flash animation saat berubah ke `true`.

### `<CameraErrorState />`
- Props: `{ errorType: CameraErrorType, onRetry: () => void }`

## Effects / Filters / Background

### `<EffectCarousel />`, `<BackgroundCarousel />`, `<FilterCarousel />`
- Props umum: `{ options: T[], selectedId: string | null, onSelect: (id: string) => void }`
- Menggunakan `<CircleThumbButton />` untuk tiap item, horizontal scroll container (`overflow-x-auto`, snap scroll opsional).

### `<CircleThumbButton />`
- Props: `{ thumbnailUrl: string, label?: string, selected: boolean, onClick: () => void }`

## Photo Review & Editing

### `<PhotoThumbnailStrip />`
- Props: `{ photos: CapturedPhoto[], activeIndex: number, onSelect: (index: number) => void }`

### `<PhotoEditor />`
- Tidak ada props; orchestrator Screen 05.
- Compose: preview besar (foto aktif + CSS filter+background live), `<PhotoThumbnailStrip />`, `<RetakeButton />`, `<BackgroundCarousel />`, `<FilterCarousel />`.

### `<RetakeButton />`
- Props: `{ slotIndex: number, onRetake: (slotIndex: number) => void }`

## Strip Editor (Composition + Sticker + Draw)

### `<StripEditor />`
- Orchestrator Screen 06 & 07.
- Compose: grid foto referensi (kiri), `<StripCanvasPreview />` (kanan), `<StickerPicker />`, `<DrawToolbar />`.

### `<StripCanvasPreview />`
- Props: `{ pack: StripPack, photos: CapturedPhoto[], stickers: PlacedSticker[], drawings: DrawingStroke[], resolution: 'preview' | 'export' }`
- Internal: memanggil `renderStrip()` dari `lib/canvas/renderStrip.ts` ke `<canvas>` ref setiap kali dependency berubah (`useEffect`).

### `<StickerPicker />`
- Props: `{ stickers: StickerAsset[], onAdd: (assetId: string) => void }`
- Grouped by category, horizontal/grid scrollable.

### `<StickerLayer />`
- Props: `{ placedStickers: PlacedSticker[], onUpdate: (id, patch) => void, onRemove: (id) => void }`
- Render elemen draggable di atas canvas preview (bisa pakai absolute-positioned DOM elements yang di-sync ke canvas saat render final, ATAU langsung interaktif di canvas — pilih pendekatan **DOM overlay untuk interaksi, canvas untuk render final** agar drag/rotate/scale lebih mudah diimplementasi dengan pointer events biasa).

### `<DrawingCanvas />`
- Props: `{ active: boolean, color: string, thickness: number, onStrokeComplete: (stroke: DrawingStroke) => void }`
- Menangani pointer down/move/up untuk menggambar freehand, render langsung ke canvas overlay yang nanti di-merge ke final render.

### `<DrawToolbar />`
- Props: `{ color: string, thickness: number, onColorChange, onThicknessChange, onErase, onClearAll }`

## Final & Share

### `<FinalPreview />`
- Tidak ada props; ambil `finalImageDataUrl` dari store.
- Compose: heading `ALL DONE ♡`, `<img>` preview, `<ShareButton />`, `<DownloadButton />`, tombol Start New.

### `<ShareButton />`
- Props: `{ imageDataUrl: string }`
- Internal: implementasi Web Share API + fallback (lihat `lib/utils/share.ts`).

### `<DownloadButton />`
- Props: `{ imageDataUrl: string, filename?: string }`

## UI Primitives

### `<Button />`
- Props: `{ variant: 'primary' | 'ghost' | 'gradient', disabled?: boolean, onClick, children }`

### `<Heading />`
- Props: `{ level: 1 | 2 | 3, children }` — styling uppercase + letter-spacing built-in.

### `<CircularSwatch />`
- Props: `{ color: string, selected: boolean, onClick: () => void, size?: number }`
