# State Machine Specification

## 1. Diagram Alur

```
IDLE
  │
  ▼
SETUP  ───────────────► (nama diisi + tema dipilih) ───► klik "ready ▷"
  │
  ▼
STRIP_SELECTION ───────► pilih layout ───► klik "next ▷"
  │
  ▼
PACK_SELECTION ────────► pilih pack ───► klik "next ▷"
  │
  ▼
CAMERA_PERMISSION ─────► getUserMedia() sukses
  │
  ▼
COUNTDOWN (3-2-1) ─────► habis ───► auto capture
  │
  ▼
CAPTURE ───────────────► foto tersimpan di slot[currentPhotoIndex]
  │
  ├─ jika currentPhotoIndex < 5 → currentPhotoIndex++ → kembali ke COUNTDOWN
  └─ jika currentPhotoIndex == 5 (foto ke-6 selesai) → lanjut
  ▼
PHOTO_REVIEW ──────────► user melihat 6 thumbnail ───► klik "lanjut edit"
  │
  ▼
EDITING ───────────────► user atur background/filter/efek per foto ───► klik "next ▷"
  │
  ▼
STRIP_COMPOSITION ─────► live compose ke strip pack terpilih ───► klik "next ▷"
  │
  ▼
STICKER_DRAW_EDITOR ───► tambah stiker/gambar (opsional, boleh skip) ───► klik "Done"
  │
  ▼
FINAL_RESULT ──────────► render final canvas, tampil "ALL DONE ♡"
  │
  ▼
SHARE ─────────────────► klik "Share to Instagram" atau "Download"
  │
  ▼
RESET (opsional) ──────► klik "Start New" ───► clear semua state ───► kembali ke SETUP
```

## 2. Definisi Entry/Exit per State

### SETUP
- **Entry:** Reset session baru (name='', themeColor=null).
- **Exit condition:** `name.trim().length > 0 && themeColor !== null`.
- **Aksi saat exit:** simpan `name`, `themeColor` ke store → pindah ke `STRIP_SELECTION`.

### STRIP_SELECTION
- **Entry:** load daftar `StripLayout[]` dari `lib/templates/stripLayouts.ts`.
- **Exit condition:** `stripLayoutId !== null`.
- **Tombol "back"** kembali ke `SETUP` (data name/theme tetap tersimpan).

### PACK_SELECTION
- **Entry:** load daftar `StripPack[]`, filter opsional berdasarkan `themeColor` (boleh tampilkan semua, highlight yang cocok tema).
- **Exit condition:** `packId !== null`.
- **Tombol "back"** kembali ke `STRIP_SELECTION`.

### CAMERA_PERMISSION
- **Entry:** panggil `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })`.
- **Sukses** → set `currentPhotoIndex = 0` → pindah ke `COUNTDOWN`.
- **Gagal** → tampilkan `<CameraErrorState />` sesuai jenis error (lihat `08-CAMERA-MODULE.md`), dengan tombol "Try Again" yang re-trigger entry.

### COUNTDOWN
- **Entry:** jalankan timer 3 → 2 → 1 (masing-masing ±800ms, total ~2.4s).
- **Exit:** otomatis setelah "1" habis → trigger capture frame dari `<video>` ke canvas sementara → pindah ke `CAPTURE`.

### CAPTURE
- **Entry:** ambil frame dari video (mirrored horizontal) ke `imageDataUrl`, simpan sebagai `CapturedPhoto` di `photos[currentPhotoIndex]`.
- **Aksi:** tampilkan flash putih singkat (150ms), update `CameraCounter` (`{n} / 6`).
- **Exit condition:**
  - Jika `currentPhotoIndex < 5`: increment index, kembali ke `COUNTDOWN`.
  - Jika `currentPhotoIndex === 5`: stop MediaStream, pindah ke `PHOTO_REVIEW`.

### PHOTO_REVIEW
- **Entry:** tampilkan 6 thumbnail + preview besar foto terakhir/terpilih.
- **User dapat:** klik thumbnail untuk preview besar, klik "Retake photo" pada slot tertentu (kembali ke `CAMERA_PERMISSION` khusus slot itu, index lain tidak berubah).
- **Exit:** klik tombol lanjut → pindah ke `EDITING`.

### EDITING
- **Entry:** tampilkan foto index 0 (atau terakhir dipilih) besar + kontrol `BackgroundCarousel` & `FilterCarousel`.
- **User dapat:** pilih foto mana yang diedit (dari thumbnail strip bawah), assign `backgroundId`/`filterId`/`effectId` ke foto tsb.
- **Exit condition:** tidak wajib semua foto diedit (default `filterId='original'`, `backgroundId=null` valid). Klik "next ▷" langsung boleh.

### STRIP_COMPOSITION
- **Entry:** render live preview canvas menggunakan `StripPack` terpilih + 6 foto (dengan filter/background/efek masing-masing).
- **Exit:** klik "next ▷" → pindah ke `STICKER_DRAW_EDITOR`. (Layar ini juga tempat tombol "✧ Stickers" dan "Draw" muncul — lihat `04-SCREENS-SPEC.md` Screen 06/07, keduanya bisa digabung secara UI tapi state logic terpisah.)

### STICKER_DRAW_EDITOR
- **Entry:** overlay `<StickerLayer />` dan `<DrawingCanvas />` di atas `<StripCanvasPreview />`.
- **User dapat:** drag/scale/rotate/delete stiker; gambar bebas dengan mouse/touch; ganti warna & ketebalan garis; hapus semua gambar.
- **Exit:** klik "Done"/"lanjut" → render final ke resolusi export → pindah ke `FINAL_RESULT`. Layar ini **boleh dilewati** (skip) tanpa stiker/gambar apapun.

### FINAL_RESULT
- **Entry:** render final canvas resolusi tinggi (900×3600), simpan `finalImageDataUrl`.
- **Tampilkan:** heading "ALL DONE ♡", preview strip, tombol "Share to Instagram" (gradient), tombol download sekunder.

### SHARE
- **Entry saat klik Share:** cek `navigator.canShare` dengan file PNG.
  - Jika didukung → `navigator.share({ files, title, text })`.
  - Jika tidak didukung / gagal → fallback: trigger download otomatis + tampilkan pesan "Your photo strip is ready to share on Instagram."
- Tidak ada auto-transisi state — user tetap di `FINAL_RESULT`/`SHARE` sampai klik "Start New".

### RESET
- **Trigger:** tombol "Start New" (harus selalu tersedia di `FINAL_RESULT`).
- **Aksi:** stop semua MediaStream aktif, revoke semua object URL, clear seluruh `PhotoBoothSession`, kembali ke `SETUP`.

## 3. Implementasi Store (Zustand) — Kontrak Fungsi

```typescript
interface PhotoBoothStore {
  session: PhotoBoothSession;
  status: SessionStatus;

  setName: (name: string) => void;
  setThemeColor: (color: ThemeColor) => void;
  goToStripSelection: () => void;      // validasi exit condition SETUP

  setStripLayout: (id: string) => void;
  goToPackSelection: () => void;

  setPack: (id: string) => void;
  goToCamera: () => void;

  startCountdown: () => void;
  capturePhoto: (dataUrl: string) => void;   // auto handle index increment
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

  finalizeStrip: (dataUrl: string) => void;   // → FINAL_RESULT
  resetSession: () => void;                   // → RESET → SETUP
}
```

Setiap fungsi `goTo*` **wajib** memvalidasi exit condition state sebelumnya; jika tidak valid, tidak melakukan transisi (no-op atau throw dev warning).
