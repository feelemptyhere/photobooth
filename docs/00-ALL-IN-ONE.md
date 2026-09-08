# AGENTS.md

Instruksi kerja untuk AI coding agent (GLM 5.2 atau agent lain) yang mengerjakan proyek ini.
**Baca file ini terlebih dahulu di setiap sesi kerja, sebelum menulis atau mengubah kode apapun.**

---

## Proyek

Online Photobooth Web App — aplikasi photobooth digital berbasis browser. User isi nama → pilih tema → pilih layout strip → pilih frame pack → ambil 6 foto lewat kamera → edit foto (background/filter/efek) → susun jadi strip photobooth → tambah stiker & gambar tangan → share/download hasil akhir.

Bukan dashboard SaaS. Bukan website marketing. Ini adalah *tool/experience* — visual minimal, editorial, playful.

## Dokumentasi

Seluruh requirement, spesifikasi teknis, dan urutan kerja ada di folder `/docs/`. **Wajib dibaca sebelum mulai coding**, urut sebagai berikut:

| Urutan | File | Isi |
|---|---|---|
| 1 | `docs/01-PRD.md` | Requirement produk, prinsip desain, non-goals |
| 2 | `docs/02-TECH-SPEC.md` | Stack, struktur folder, semua data model TypeScript |
| 3 | `docs/03-STATE-MACHINE.md` | Alur state, entry/exit condition, kontrak store Zustand |
| 4 | `docs/04-SCREENS-SPEC.md` | Spesifikasi UI detail tiap layar (Screen 01–09) |
| 5 | `docs/05-COMPONENT-ARCHITECTURE.md` | Kontrak komponen React & props |
| 6 | `docs/06-TEMPLATE-SYSTEM.md` | Struktur data template strip pack (data-driven, wajib) |
| 7 | `docs/07-CANVAS-RENDER-ENGINE.md` | Spesifikasi engine render Canvas |
| 8 | `docs/08-CAMERA-MODULE.md` | Modul kamera, countdown, error handling |
| 9 | `docs/09-TASK-BREAKDOWN.md` | Urutan 11 fase pengerjaan — **ikuti urutan ini, jangan lompat fase** |
| 10 | `docs/11-ACCEPTANCE-CRITERIA.md` | 25 checklist QA end-to-end sebelum dianggap selesai |

Kalau butuh satu file spec gabungan untuk context window terbatas, gunakan `docs/00-ALL-IN-ONE.md` (gabungan semua file di atas).

## Aturan Kerja (wajib dipatuhi)

1. **Kerjakan satu fase pada satu waktu**, sesuai urutan di `docs/09-TASK-BREAKDOWN.md`. Jangan mengerjakan fase berikutnya sebelum fase sekarang selesai dan bisa dijalankan/diuji.
2. **Jangan menyimpang dari kontrak data model** (`docs/02-TECH-SPEC.md` §2) dan kontrak komponen (`docs/05-COMPONENT-ARCHITECTURE.md`) kecuali ada alasan teknis kuat — jika terpaksa menyimpang, jelaskan alasannya di komentar kode.
3. **Arsitektur wajib data-driven** untuk strip pack, layout, filter, background, effect, sticker. Dilarang hardcode satu strip/tema tunggal di dalam komponen. Verifikasi dengan tes: "tambah 1 data baru ke array → langsung muncul di UI tanpa ubah kode komponen manapun."
4. **Render final wajib pakai Canvas API murni** (`CanvasRenderingContext2D`), bukan screenshot DOM. `html2canvas` atau sejenisnya **dilarang**.
5. **Tidak ada backend/database/auth** untuk MVP. Semua state di client (Zustand), semua foto tetap di browser, tidak pernah dikirim ke server manapun.
6. **Cleanup resource wajib**: `MediaStream`, object URL, timer/interval — checklist lengkap ada di `docs/08-CAMERA-MODULE.md` §7.
7. **Visual style wajib mengikuti prinsip di `docs/01-PRD.md` §4** — whitespace besar, tipografi tipis uppercase letter-spacing lebar, kontrol berbentuk thumbnail bulat/strip visual. **Dilarang**: sidebar, navbar kompleks, card shadow tebal, tampilan dashboard SaaS.
8. **Semua aset visual (background, efek wajah, stiker, texture pack) adalah placeholder buatan sendiri** — SVG/PNG sederhana original, bukan aset berhak cipta/bermerek dari sumber manapun (termasuk logo Instagram resmi — buat versi gradient representasi original).
9. Setelah menyelesaikan tiap fase, **jalankan checklist test manual** yang tercantum di fase tersebut (`docs/09-TASK-BREAKDOWN.md`) sebelum melanjutkan ke fase berikutnya.
10. Jika ada ambiguitas spesifikasi yang tidak terjawab di dokumen manapun, **buat keputusan implementasi sendiri yang masuk akal** dan dokumentasikan singkat di komentar kode. Jangan berhenti untuk bertanya kecuali benar-benar blocking (mis. kredensial, akses eksternal).
11. **Laporkan status setiap selesai satu fase** dan tunggu konfirmasi sebelum lanjut ke fase berikutnya, kecuali diinstruksikan sebaliknya oleh user.

## Struktur Folder Proyek

```
photobooth-app/
├── AGENTS.md                   ← file ini
├── README.md
├── docs/                       ← semua dokumen spesifikasi (lihat tabel di atas)
├── app/                        ← Next.js App Router (entry point tipis)
├── components/                 ← dikelompokkan per screen/fitur
│   ├── shell/  setup/  strip/  pack/  camera/
│   ├── effects/  review/  stripEditor/  final/  ui/
├── lib/                        ← logic non-UI
│   ├── state/  canvas/  camera/  templates/  assets/  utils/
├── public/assets/               ← aset placeholder (backgrounds, effects, stickers, textures)
└── types/index.ts               ← semua interface TypeScript terpusat
```

Detail lengkap tiap folder ada di `docs/02-TECH-SPEC.md` §1.

## Definition of Done

Proyek dianggap selesai hanya jika **seluruh 25 kriteria** di `docs/11-ACCEPTANCE-CRITERIA.md` lulus, dan alur berikut bisa dimainkan penuh tanpa error console:

```
SETUP → STRIP → PACK → CAMERA → 6 FOTO → EFEK → EDIT →
MAKE STRIP → STICKERS/DRAW → ALL DONE → SHARE
```

## Cara Memulai Sesi Baru

Gunakan prompt berikut sebagai pesan pertama ke agent:

> "Baca AGENTS.md, lalu baca seluruh dokumen di `/docs/` sesuai urutan yang tercantum. Setelah paham, mulai kerjakan FASE 0 (Project Bootstrap) dari `docs/09-TASK-BREAKDOWN.md`. Setelah FASE 0 selesai dan bisa dijalankan (`npm run dev` tanpa error), laporkan status dan tunggu konfirmasi sebelum lanjut ke FASE 1."

Jika melanjutkan sesi yang sudah berjalan, cukup: **"Lanjutkan dari FASE [n] sesuai `docs/09-TASK-BREAKDOWN.md`."**
# PRD — Online Photobooth Web App

**Codename:** `snapstrip` (ganti sesuai brand kamu)
**Versi dokumen:** 1.0
**Tanggal:** 2026-09-08
**Status:** Ready for development
**Target eksekutor:** AI coding agent (GLM 5.2) — dokumen ini ditulis agar bisa langsung dieksekusi tanpa banyak klarifikasi lanjutan.

---

## 1. Ringkasan Produk

Web app photobooth digital berbasis browser. User memasukkan nama, memilih tema warna, memilih layout strip, memilih pack desain frame, mengambil 6 foto lewat kamera browser, mengedit foto (background/filter/efek), menyusun foto ke dalam strip photobooth, menambahkan stiker dan gambar tangan, lalu membagikan hasil akhir ke Instagram (atau fallback download).

**Bukan** dashboard SaaS. **Bukan** website marketing. Ini adalah *tool/experience* — begitu masuk, user harus langsung merasa "masuk ke dalam photobooth".

## 2. Tujuan & Non-Tujuan

### Tujuan (goals)
- Alur end-to-end bisa dimainkan penuh: Setup → Strip → Pack → Camera → 6 Foto → Efek → Edit → Susun Strip → Stiker/Gambar → Hasil Akhir → Share.
- Semua diproses di client-side (privacy-first), tanpa backend/auth untuk MVP.
- Output akhir adalah file PNG resolusi tinggi (render dari Canvas, bukan screenshot HTML).
- Visual minimal, editorial, playful — bukan gaya dashboard korporat.
- Sepenuhnya responsif: desktop, tablet, mobile.

### Non-tujuan (out of scope untuk MVP)
- Autentikasi user / akun
- Database / backend penyimpanan foto
- Upload otomatis langsung ke Instagram API (tidak didukung dari browser — gunakan Web Share API + fallback)
- Face landmark tracking canggih (opsional/advanced, bukan syarat MVP)
- Multi-bahasa (boleh hardcode Bahasa Indonesia atau Inggris, konsisten)

## 3. Target Pengguna

Pengguna umum yang ingin membuat photobooth strip digital untuk acara, media sosial, atau hiburan pribadi. Diakses lewat browser desktop besar (mis. layar sentuh event) maupun HP.

## 4. Prinsip Desain (WAJIB dipatuhi agent)

1. **Whitespace besar**, background putih/near-white.
2. **Tipografi tipis, uppercase, letter-spacing lebar** untuk heading.
3. **Satu layar = satu keputusan.** Jangan tampilkan semua kontrol sekaligus.
4. **Kontrol berbentuk thumbnail bulat/strip visual**, bukan form/table.
5. **Strip preview selalu vertikal & terlihat seperti strip fisik**, bukan card kotak generik.
6. **Animasi halus saja** — transisi layar, hover, countdown, flash kamera.
7. **Dilarang:** sidebar, navbar kompleks, heavy card shadow, gradient besar-besaran (kecuali tombol Share Instagram), dashboard look.

## 5. Arsitektur Informasi — Alur Layar (State Machine)

```
IDLE
 → SETUP                  (Screen 01: nama + tema warna)
 → STRIP_SELECTION        (Screen 02: pilih layout strip)
 → PACK_SELECTION         (Screen 03: pilih frame/design pack)
 → CAMERA_PERMISSION      (request getUserMedia)
 → COUNTDOWN              (3-2-1 sebelum tiap capture)
 → CAPTURE                (Screen 04: ambil 6 foto)
 → PHOTO_REVIEW           (review thumbnail 6 foto)
 → EDITING                (Screen 05: background/filter/efek per foto)
 → STRIP_COMPOSITION      (Screen 06: Make Your Strip, live preview)
 → STICKER_DRAW_EDITOR    (Screen 07: stiker & gambar tangan)
 → FINAL_RESULT           (Screen 08: All Done ♡)
 → SHARE                  (Screen 09: share/download)
 → RESET                  (Start New → clear semua state)
```

Setiap state punya **entry condition** dan **exit condition** yang jelas — didetailkan di `03-STATE-MACHINE.md`.

## 6. Deliverables Dokumen (paket dokumentasi ini)

| File | Isi |
|---|---|
| `01-PRD.md` | Dokumen ini — product requirement lengkap |
| `02-TECH-SPEC.md` | Spesifikasi teknis: stack, struktur folder, data model, API canvas |
| `03-STATE-MACHINE.md` | Detail state machine & transisi antar layar |
| `04-SCREENS-SPEC.md` | Spesifikasi UI per layar (Screen 01–09), termasuk komponen & copy |
| `05-COMPONENT-ARCHITECTURE.md` | Daftar komponen React + props + tanggung jawab |
| `06-TEMPLATE-SYSTEM.md` | Struktur data template strip pack (data-driven) |
| `07-CANVAS-RENDER-ENGINE.md` | Spesifikasi engine render Canvas (layer, urutan, export) |
| `08-CAMERA-MODULE.md` | Spesifikasi modul kamera, countdown, capture, error handling |
| `09-TASK-BREAKDOWN.md` | Breakdown task per fase pengerjaan (untuk agent dikerjakan bertahap) |
| `10-AGENT-INSTRUCTIONS.md` | System prompt / instruksi kerja untuk AI coding agent (GLM 5.2) |
| `11-ACCEPTANCE-CRITERIA.md` | Checklist QA end-to-end sebelum dianggap selesai |

## 7. Stack Teknologi (Keputusan Final)

- **Framework:** Next.js 14 (App Router)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS
- **State management:** Zustand (single store, persisted ke sessionStorage saja, bukan localStorage permanen)
- **Kamera:** MediaDevices API (`getUserMedia`)
- **Rendering final:** HTML Canvas API (2D context) — wajib, dilarang pakai `html2canvas`/screenshot DOM
- **Animasi:** Framer Motion
- **Drawing tool:** native canvas pointer events
- **Storage sementara:** in-memory (Zustand) + opsional IndexedDB untuk foto besar agar tidak membebani memory
- **Tidak ada backend, tidak ada database, tidak ada auth** untuk MVP

## 8. Batasan & Asumsi

- Aset visual (background, efek wajah, stiker, texture pack) akan berupa **placeholder SVG/PNG buatan sendiri** — bukan aset bermerek/berhak cipta dari referensi video.
- Efek wajah (cat ears, dll) untuk MVP cukup **overlay statis posisi tengah-atas frame**, bukan face-tracking real-time. Face landmark tracking (face-api.js/MediaPipe) adalah **enhancement opsional Fase 11**, bukan syarat MVP.
- Nama brand, footer text (`yourbrand.com`), dan warna spesifik adalah **konfigurasi**, bukan hardcode dari referensi.
- Semua foto & data sesi **tidak pernah dikirim ke server manapun**.

## 9. Metrik Keberhasilan MVP

Lihat `11-ACCEPTANCE-CRITERIA.md` — 25 kriteria end-to-end harus lulus semua.

## 10. Referensi Prioritas Pengerjaan

Lihat `09-TASK-BREAKDOWN.md` untuk urutan 10 fase pengerjaan agar agent tidak mengerjakan semua sekaligus dan menghasilkan kode yang sulit di-debug.
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
# Screens Specification (UI Detail per Layar)

Catatan umum: semua heading uppercase, letter-spacing lebar, font sans-serif tipis (`font-weight: 300-400`). Background selalu putih/near-white (`#FAFAFA` atau `#FFFFFF`). Tombol utama besar, rounded, kontras minimal (hitam/abu di atas putih), kecuali tombol Share Instagram yang pakai gradient.

---

## SCREEN 01 — USER SETUP

**Komponen:** `<SetupScreen />`

**Layout (desktop):** konten center, max-width ±480px, vertical center.

**Elemen:**
1. Heading kecil: `YOU`
2. `<NameInput />` — input rectangular besar, placeholder `"your name"`, border tipis bawah saja atau full border tipis (bukan shadow tebal).
3. `<ThemePicker />` — 2 lingkaran besar (±64px diameter):
   - Swatch 1: pink/merah muda pudar (`#E8A0A8` misalnya)
   - Swatch 2: biru terang (`#4A90E2` misalnya)
   - State selected: ring outline tipis + scale 1.05, animasi Framer Motion `spring`.
4. Tombol `ready ▷`:
   - Disabled state: abu muda, opacity 0.5, cursor not-allowed — aktif ketika `name.length > 0 && themeColor selected`.
   - Enabled state: hitam solid / abu gelap, teks putih.

**Copy (ID/EN campur sesuai referensi asli boleh dipakai apa adanya):** `"your name"`, `"ready ▷"`.

**Mobile:** stack vertikal sama, lebar 90% viewport, tombol full-width.

---

## SCREEN 02 — CHOOSE YOUR STRIP

**Komponen:** `<StripLayoutSelector />`

**Heading:** `CHOOSE YOUR STRIP` (center, top).

**Konten:** row horizontal (scrollable di mobile) berisi `<StripLayoutCard />` — tiap card render preview grid sederhana pakai garis outline tipis (SVG), sesuai jumlah slot layout:

- `1×4`: satu kolom, 4 baris kotak
- `2×2`: dua kolom, dua baris
- `1×3`: satu kolom, 3 baris

Selected state: border solid tipis + scale 1.03.

**Footer nav:** `back` (kiri, teks saja/ghost button) — `next ▷` (kanan, solid button, disabled sampai ada pilihan).

---

## SCREEN 03 — COLOR THEMES / FRAME PACKS

**Komponen:** `<PackSelector />`

**Heading:** `COLOR THEMES` dengan sub-label kecil `△ packs`.

**Konten:** row horizontal scrollable berisi `<PackThumbnail />` — tiap thumbnail adalah **miniatur strip vertikal utuh** (bukan card kotak generik), render menggunakan `background`, `textureUrl`, dan preview slot foto placeholder dari `StripPack` data.

Minimal 4 pack contoh (nama bebas, bukan brand asli):
- Pack "Bistro" — krem, dekorasi warna-warni di tepi
- Pack "Sweetheart" — pink/coklat, dekorasi hati
- Pack "Meadow" — hijau muda, minimal
- Pack "Retro Film" — coklat tua/olive, gaya retro

Selected state: highlight ring + sedikit elevasi (translateY -4px).

**Footer nav:** `back` / `next ▷` sama seperti Screen 02.

---

## SCREEN 04 — PHOTO CAPTURE

**Komponen:** `<CameraStage />`

**Layout:** video preview besar mengisi mayoritas viewport, **mirrored horizontal** (`transform: scaleX(-1)`).

**Elemen overlay:**
1. `<CameraCounter />` — top center, teks besar: `1 / 6` → berubah tiap capture.
2. `<Countdown />` — angka besar center-screen (`3`, `2`, `1`), fade+scale animation, muncul sesaat sebelum tiap capture.
3. `<CaptureFlash />` — flash putih fullscreen 150ms setelah capture.
4. Kontrol bawah/overlay:
   - `BACKGROUND` — label kecil + `<BackgroundCarousel />` (thumbnail bulat horizontal scroll)
   - `FILTER` — label kecil + `<FilterCarousel />` (thumbnail bulat horizontal scroll)
   - Efek wajah (opsional muncul di row terpisah atau gabung dengan BACKGROUND row) — `<EffectCarousel />`

**Error state:** jika kamera gagal, tampilkan `<CameraErrorState />` (lihat `08-CAMERA-MODULE.md`) menggantikan video area, dengan tombol `Try Again`.

**Behavior:** begitu 6 foto selesai (`currentPhotoIndex` mencapai 5 dan capture selesai), otomatis stop stream dan transisi ke Screen berikutnya (Photo Review), tanpa perlu klik manual.

---

## SCREEN 05 — PHOTO EDIT / EFFECTS (Photo Review + Editing)

Digabung secara UI dari 2 state (`PHOTO_REVIEW` + `EDITING`) menjadi satu layar dengan 2 mode tab implisit, atau berurutan — keputusan implementasi bebas, tapi **struktur berikut wajib ada**:

**Komponen:** `<PhotoEditor />`

**Layout:**
- Preview besar foto yang sedang dipilih (menerapkan filter/background/efek CSS secara live).
- `<PhotoThumbnailStrip />` di bawah — 6 thumbnail, yang aktif diberi border/scale highlight. Klik thumbnail → ganti foto yang diedit di preview besar.
- `<RetakeButton />` — muncul di dekat preview besar atau di setiap thumbnail (icon kecil), memicu retake untuk slot tsb.
- Baris kontrol di bawah thumbnail:
  - `BACKGROUND` + `<BackgroundCarousel />`
  - `FILTER` + `<FilterCarousel />`

**Footer nav:** `back` / `next ▷` → lanjut ke Screen 06 (Make Your Strip).

---

## SCREEN 06 — MAKE YOUR STRIP

**Komponen:** `<StripEditor />` (mode composition, belum termasuk sticker/draw aktif)

**Heading:** `MAKE YOUR STRIP`

**Layout dua kolom (desktop):**
- **Kiri:** grid 6 foto hasil capture (thumbnail, bisa diklik untuk highlight foto mana masuk slot mana — tapi untuk MVP, urutan slot = urutan capture, jadi grid ini bersifat display-only/reference).
- **Kanan:** `<StripCanvasPreview />` — live render canvas menampilkan strip pack terpilih dengan 6 foto tersusun sesuai `photoSlots` dari `StripPack`, update instan ketika foto/filter berubah.

**Mobile:** stack vertikal — grid foto di atas, strip preview di bawah, atau strip preview full lalu grid collapsible.

**Footer nav:** `back` / `next ▷` → lanjut ke Screen 07.

---

## SCREEN 07 — STICKERS / DRAW

**Komponen:** overlay tambahan pada `<StripEditor />`: `<StickerPicker />`, `<StickerLayer />`, `<DrawingCanvas />`, `<DrawToolbar />`.

**Elemen:**
1. Dua tombol toggle di atas/samping strip preview:
   - `✧ Stickers` — membuka panel pilihan stiker (grid kecil kategori: Hearts, Stars, Flowers, Characters, Bows, Sparkles, Food, Animals, Shapes).
   - `Draw` — mengaktifkan mode gambar bebas di atas canvas, dengan toolbar kecil: pilihan warna (swatch), ketebalan garis (slider/opsi kecil), tombol erase, tombol clear all.
2. Stiker yang ditempatkan bisa: **drag** (pointer move), **scale** (pinch/handle), **rotate** (handle), **delete** (tombol × muncul saat selected).
3. Layar ini **skippable** — tombol `skip` atau langsung `next ▷` tanpa menambah apapun tetap valid.

**Footer nav:** `back` / `next ▷ (Done)` → render final, lanjut ke Screen 08.

---

## SCREEN 08 — FINAL RESULT

**Komponen:** `<FinalPreview />`

**Heading:** `ALL DONE ♡` (center, top)

**Konten:** preview besar strip final (hasil render resolusi tinggi, ditampilkan di-scale untuk layar), centered.

**Tombol utama:** `Share to Instagram` — full width/large, **gradient** kuning→pink→ungu (gaya Instagram), dengan icon Instagram-like (buat versi original, jangan pakai logo resmi bermerek dagang persis — gunakan bentuk kamera/gradient sebagai representasi visual, hindari isu trademark).

**Tombol sekunder:** `Download` (icon download, lebih kecil/ghost style) — selalu tersedia sebagai fallback.

**Tombol tersier:** `Start New` — mereset seluruh sesi.

---

## SCREEN 09 — SHARE (bagian dari interaksi FINAL_RESULT, bukan layar terpisah secara visual)

Saat klik `Share to Instagram`:
1. Cek `navigator.canShare({ files: [pngFile] })`.
2. Jika true → panggil `navigator.share(...)`.
3. Jika false/gagal/exception →
   - Trigger download otomatis via `<DownloadButton />` logic.
   - Tampilkan toast/pesan kecil: `"Your photo strip is ready to share on Instagram."`
4. **Dilarang** menampilkan pesan sukses palsu seolah sudah ter-upload ke Instagram — Instagram tidak punya API upload langsung dari web biasa.
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
# Template System — Strip Layouts & Packs (Data-Driven)

Prinsip: **dilarang hardcode satu strip tunggal di kode komponen.** Semua variasi harus datang dari data di `lib/templates/`.

## 1. Strip Layouts (`lib/templates/stripLayouts.ts`)

```typescript
import { StripLayout } from '@/types';

export const stripLayouts: StripLayout[] = [
  {
    id: '1x4',
    name: '1 × 4',
    slotCount: 4,
    gridPreview: 'col-1-row-4',
  },
  {
    id: '2x2',
    name: '2 × 2',
    slotCount: 4,
    gridPreview: 'col-2-row-2',
  },
  {
    id: '1x3',
    name: '1 × 3',
    slotCount: 3,
    gridPreview: 'col-1-row-3',
  },
  {
    id: '1x6',
    name: '1 × 6',
    slotCount: 6,
    gridPreview: 'col-1-row-6',
  },
];
```

> Catatan: karena kamera SELALU mengambil 6 foto (syarat wajib), layout dengan `slotCount < 6` (mis. `1x4`) berarti hanya sebagian foto dipakai di strip (user bisa pilih 4 dari 6, ATAU strip menampilkan 4 pertama — tentukan sendiri, sarankan: strip `1x6` sebagai default utama, layout lain sebagai varian dekoratif dengan foto terpilih user pada Screen 06). Dokumentasikan keputusan final di kode dengan komentar agar konsisten.

## 2. Strip Packs (`lib/templates/stripPacks.ts`)

Contoh lengkap 4 pack sebagai starting point (nama & warna original, bukan dari referensi video):

```typescript
import { StripPack } from '@/types';

const BASE_W = 300;
const BASE_H = 1200;

export const stripPacks: StripPack[] = [
  {
    id: 'bistro',
    name: 'Bistro',
    width: BASE_W,
    height: BASE_H,
    background: '#F7F1E8',
    textureUrl: '/assets/pack-textures/bistro-texture.png',
    photoSlots: [
      { index: 0, x: 20, y: 30,  width: 260, height: 170, fit: 'cover' },
      { index: 1, x: 20, y: 215, width: 260, height: 170, fit: 'cover' },
      { index: 2, x: 20, y: 400, width: 260, height: 170, fit: 'cover' },
      { index: 3, x: 20, y: 585, width: 260, height: 170, fit: 'cover' },
      { index: 4, x: 20, y: 770, width: 260, height: 170, fit: 'cover' },
      { index: 5, x: 20, y: 955, width: 260, height: 170, fit: 'cover' },
    ],
    decorativeElements: [
      { id: 'bistro-corner-tl', imageUrl: '/assets/pack-textures/bistro-corner.png', x: 0, y: 0, width: 60, height: 60, zIndex: 10 },
    ],
    typography: { fontFamily: 'var(--font-editorial)', footerColor: '#3A2E1F' },
    footer: { showDate: true, brandText: 'yourbrand.com' },
  },
  {
    id: 'sweetheart',
    name: 'Sweetheart',
    width: BASE_W,
    height: BASE_H,
    background: '#F3D9DC',
    textureUrl: undefined,
    photoSlots: [
      { index: 0, x: 20, y: 30,  width: 260, height: 170, fit: 'cover' },
      { index: 1, x: 20, y: 215, width: 260, height: 170, fit: 'cover' },
      { index: 2, x: 20, y: 400, width: 260, height: 170, fit: 'cover' },
      { index: 3, x: 20, y: 585, width: 260, height: 170, fit: 'cover' },
      { index: 4, x: 20, y: 770, width: 260, height: 170, fit: 'cover' },
      { index: 5, x: 20, y: 955, width: 260, height: 170, fit: 'cover' },
    ],
    decorativeElements: [
      { id: 'sweetheart-heart-1', imageUrl: '/assets/pack-textures/heart-sticker.png', x: 220, y: 10, width: 40, height: 40, zIndex: 10 },
    ],
    typography: { fontFamily: 'var(--font-editorial)', footerColor: '#6B3F3F' },
    footer: { showDate: true, brandText: 'yourbrand.com' },
  },
  {
    id: 'meadow',
    name: 'Meadow',
    width: BASE_W,
    height: BASE_H,
    background: '#E4EFE0',
    photoSlots: [
      { index: 0, x: 20, y: 30,  width: 260, height: 170, fit: 'cover' },
      { index: 1, x: 20, y: 215, width: 260, height: 170, fit: 'cover' },
      { index: 2, x: 20, y: 400, width: 260, height: 170, fit: 'cover' },
      { index: 3, x: 20, y: 585, width: 260, height: 170, fit: 'cover' },
      { index: 4, x: 20, y: 770, width: 260, height: 170, fit: 'cover' },
      { index: 5, x: 20, y: 955, width: 260, height: 170, fit: 'cover' },
    ],
    decorativeElements: [],
    typography: { fontFamily: 'var(--font-editorial)', footerColor: '#3E4F3A' },
    footer: { showDate: true, brandText: 'yourbrand.com' },
  },
  {
    id: 'retro-film',
    name: 'Retro Film',
    width: BASE_W,
    height: BASE_H,
    background: '#4A3F2F',
    photoSlots: [
      { index: 0, x: 20, y: 30,  width: 260, height: 170, fit: 'cover' },
      { index: 1, x: 20, y: 215, width: 260, height: 170, fit: 'cover' },
      { index: 2, x: 20, y: 400, width: 260, height: 170, fit: 'cover' },
      { index: 3, x: 20, y: 585, width: 260, height: 170, fit: 'cover' },
      { index: 4, x: 20, y: 770, width: 260, height: 170, fit: 'cover' },
      { index: 5, x: 20, y: 955, width: 260, height: 170, fit: 'cover' },
    ],
    decorativeElements: [],
    typography: { fontFamily: 'var(--font-editorial)', footerColor: '#EDE6D6' },
    footer: { showDate: true, brandText: 'yourbrand.com' },
  },
];
```

## 3. Aturan Menambah Pack Baru

Agent (atau developer manapun) menambah pack baru **cukup dengan menambah satu object baru** ke array `stripPacks`, tanpa mengubah kode `<StripEditor />`, `<PackSelector />`, atau `renderStrip()`. Ini adalah syarat wajib arsitektur (lihat spec asli poin 32 — "This allows additional packs to be added without changing the editor code").

## 4. Filters, Backgrounds, Effects, Stickers — Struktur Data Serupa

Semua di `lib/assets/*.ts`, mengikuti pola array data-driven yang sama:

```typescript
// lib/assets/filters.ts
export const filters: FilterDef[] = [
  { id: 'original', name: 'Original', cssFilter: 'none' },
  { id: 'soft',      name: 'Soft',      cssFilter: 'brightness(1.05) contrast(0.95) saturate(0.9)' },
  { id: 'warm',      name: 'Warm',      cssFilter: 'sepia(0.15) saturate(1.2) brightness(1.05)' },
  { id: 'cool',      name: 'Cool',      cssFilter: 'hue-rotate(10deg) saturate(1.05) brightness(1.02)' },
  { id: 'vintage',   name: 'Vintage',   cssFilter: 'sepia(0.35) contrast(1.1) brightness(0.95)' },
  { id: 'bw',        name: 'B & W',     cssFilter: 'grayscale(1) contrast(1.1)' },
  { id: 'contrast',  name: 'Contrast',  cssFilter: 'contrast(1.3)' },
  { id: 'retro',     name: 'Retro',     cssFilter: 'sepia(0.25) hue-rotate(-10deg) saturate(1.3)' },
];
```

Background & effect & sticker assets: placeholder path ke `/public/assets/...`, boleh generate SVG sederhana sebagai placeholder awal (lihat `09-TASK-BREAKDOWN.md` Fase 3 & 6 untuk instruksi pembuatan aset placeholder).
# Canvas Render Engine Specification

## 1. Prinsip Wajib

- **DILARANG** menggunakan `html2canvas` atau screenshot DOM untuk hasil akhir. Semua render final **harus** lewat `CanvasRenderingContext2D` murni, agar resolusi ekspor terkontrol penuh dan tajam.
- Fungsi render harus **pure & deterministic**: input sama (pack, photos, stickers, drawings, resolution) selalu menghasilkan output sama.
- Fungsi render dipakai **dua kali**: sekali untuk live preview (resolusi rendah/cepat), sekali untuk export final (resolusi tinggi). **Gunakan fungsi yang sama**, hanya beda parameter `scaleFactor`.

## 2. Urutan Layer Compositing (WAJIB URUT SEPERTI INI)

```
1. Background       → warna solid / gradient dari StripPack.background
2. Texture          → image overlay dari StripPack.textureUrl (jika ada), opacity/blend sesuai desain
3. Photo Slots      → tiap foto di-draw sesuai PhotoSlotDef (x, y, width, height, rotation, fit)
4. Photo Effects    → filter CSS diterapkan SEBELUM draw ke canvas (lihat 3.2), background photo effect (BackgroundOption) di-composite di belakang foto jika foto punya transparent area, atau efek wajah overlay di atas foto
5. Frame            → border/frame graphic jika didefinisikan di pack (opsional, bisa gabung ke decorativeElements)
6. Decorative Elements → dari StripPack.decorativeElements, urut berdasarkan zIndex
7. Stickers         → dari session.stickers, posisi/scale/rotation sesuai PlacedSticker
8. User Drawings    → dari session.drawings, tiap DrawingStroke di-draw sebagai path
9. Text             → nama user (opsional ditampilkan) / label lain jika didefinisikan
10. Footer          → tanggal (format YYYY . MM . DD) + brandText dari StripPack.footer
```

## 3. Implementasi Fungsi Utama

### 3.1 `renderStrip()` — `lib/canvas/renderStrip.ts`

```typescript
interface RenderStripParams {
  canvas: HTMLCanvasElement;
  pack: StripPack;
  photos: CapturedPhoto[];       // urut sesuai slotIndex, panjang harus match photoSlots
  stickers: PlacedSticker[];
  drawings: DrawingStroke[];
  userName?: string;
  scaleFactor: number;           // 1 = preview base resolution, 3 = export resolution
}

export async function renderStrip(params: RenderStripParams): Promise<void> {
  const { canvas, pack, photos, stickers, drawings, scaleFactor } = params;
  const ctx = canvas.getContext('2d')!;

  canvas.width = pack.width * scaleFactor;
  canvas.height = pack.height * scaleFactor;
  ctx.scale(scaleFactor, scaleFactor);
  ctx.clearRect(0, 0, pack.width, pack.height);

  // 1. Background
  ctx.fillStyle = pack.background;
  ctx.fillRect(0, 0, pack.width, pack.height);

  // 2. Texture
  if (pack.textureUrl) {
    const textureImg = await loadImage(pack.textureUrl);
    ctx.drawImage(textureImg, 0, 0, pack.width, pack.height);
  }

  // 3 & 4. Photo Slots + effects
  for (const slot of pack.photoSlots) {
    const photo = photos[slot.index];
    if (!photo) continue;
    await drawPhotoIntoSlot(ctx, photo, slot);
  }

  // 6. Decorative elements
  const sortedDecor = [...pack.decorativeElements].sort((a, b) => a.zIndex - b.zIndex);
  for (const el of sortedDecor) {
    const img = await loadImage(el.imageUrl);
    ctx.drawImage(img, el.x, el.y, el.width, el.height);
  }

  // 7. Stickers
  for (const sticker of stickers) {
    await drawSticker(ctx, sticker);
  }

  // 8. Drawings
  for (const stroke of drawings) {
    drawStroke(ctx, stroke);
  }

  // 10. Footer
  drawFooter(ctx, pack);
}
```

### 3.2 `drawPhotoIntoSlot()` — menerapkan filter + fit (cover/contain)

```typescript
async function drawPhotoIntoSlot(
  ctx: CanvasRenderingContext2D,
  photo: CapturedPhoto,
  slot: PhotoSlotDef
) {
  const img = await loadImage(photo.imageDataUrl);
  const filterDef = filters.find(f => f.id === photo.filterId);

  ctx.save();
  ctx.filter = filterDef?.cssFilter ?? 'none';   // Canvas 2D context mendukung ctx.filter di browser modern

  // hitung source rect sesuai fit: cover atau contain
  const { sx, sy, sw, sh } = computeSourceRect(img, slot.width, slot.height, slot.fit);

  if (slot.rotation) {
    ctx.translate(slot.x + slot.width / 2, slot.y + slot.height / 2);
    ctx.rotate((slot.rotation * Math.PI) / 180);
    ctx.drawImage(img, sx, sy, sw, sh, -slot.width / 2, -slot.height / 2, slot.width, slot.height);
  } else {
    ctx.drawImage(img, sx, sy, sw, sh, slot.x, slot.y, slot.width, slot.height);
  }

  ctx.restore();

  // efek wajah overlay (jika ada), digambar setelah foto, di dalam bounding slot
  if (photo.effectId) {
    const effect = effects.find(e => e.id === photo.effectId);
    if (effect) {
      const effectImg = await loadImage(effect.overlayImageUrl);
      ctx.drawImage(effectImg, slot.x, slot.y, slot.width, slot.height);
    }
  }
}
```

> **Catatan penting:** `ctx.filter` (CSS-filter-like di Canvas 2D) didukung di Chrome/Edge/Firefox/Safari modern. Jika target harus mendukung browser sangat lama, siapkan fallback manual pixel manipulation — namun untuk MVP, `ctx.filter` cukup.

### 3.3 `computeSourceRect()` — cover/contain logic

Implementasi standar "object-fit" manual: hitung crop area dari image asli agar mengisi target `width`/`height` tanpa distorsi (untuk `cover`) atau menyesuaikan dalam batas tanpa crop (untuk `contain`).

### 3.4 `loadImage()` helper

```typescript
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
```
Cache hasil load di `Map<string, HTMLImageElement>` module-level agar tidak reload berulang saat live preview re-render tiap perubahan kecil.

### 3.5 `drawFooter()`

```typescript
function drawFooter(ctx: CanvasRenderingContext2D, pack: StripPack) {
  if (!pack.footer.showDate && !pack.footer.brandText) return;
  const date = formatDate(new Date()); // "2026 . 09 . 08"
  ctx.fillStyle = pack.typography.footerColor;
  ctx.font = `12px ${pack.typography.fontFamily}`;
  ctx.textAlign = 'center';
  const footerY = pack.height - 30;
  if (pack.footer.showDate) ctx.fillText(date, pack.width / 2, footerY);
  if (pack.footer.brandText) ctx.fillText(pack.footer.brandText, pack.width / 2, footerY + 16);
}
```

## 4. Live Preview vs Export

- **Live preview** (`<StripCanvasPreview />`): `scaleFactor = 1` (300×1200), di-render ulang lewat `useEffect` setiap `photos`, `stickers`, atau `drawings` berubah — **debounce ~100ms** agar tidak render berlebihan saat drag sticker.
- **Export final**: dipanggil sekali saat masuk `FINAL_RESULT`, `scaleFactor = 3` (900×3600), hasil `canvas.toDataURL('image/png')` disimpan ke `finalImageDataUrl`.

## 5. Drawing Tool — Detail Teknis

`<DrawingCanvas />` menangkap stroke di layer canvas **terpisah** (transparent overlay) selama mode aktif, lalu setiap stroke selesai (`pointerup`) di-convert ke `DrawingStroke` (array titik) dan disimpan ke store — bukan langsung merge ke canvas utama, agar tetap bisa undo/clear sebelum final render.

```typescript
function drawStroke(ctx: CanvasRenderingContext2D, stroke: DrawingStroke) {
  if (stroke.points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.thickness;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length; i++) {
    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  }
  ctx.stroke();
  ctx.restore();
}
```

## 6. Sticker Rendering

```typescript
async function drawSticker(ctx: CanvasRenderingContext2D, sticker: PlacedSticker) {
  const asset = stickerAssets.find(s => s.id === sticker.stickerAssetId);
  if (!asset) return;
  const img = await loadImage(asset.imageUrl);
  ctx.save();
  ctx.translate(sticker.x, sticker.y);
  ctx.rotate((sticker.rotation * Math.PI) / 180);
  ctx.scale(sticker.scale, sticker.scale);
  const baseSize = 60; // ukuran dasar sticker di base resolution
  ctx.drawImage(img, -baseSize / 2, -baseSize / 2, baseSize, baseSize);
  ctx.restore();
}
```

## 7. Export & Download

```typescript
// lib/utils/download.ts
export function downloadImage(dataUrl: string, filename = 'photobooth-strip.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```
# Camera Module Specification

## 1. `useCamera()` Hook

```typescript
// lib/camera/useCamera.ts
import { useRef, useState, useCallback, useEffect } from 'react';

export type CameraErrorType =
  | 'permission_denied'
  | 'not_found'
  | 'not_supported'
  | 'stream_failure'
  | null;

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<CameraErrorType>(null);
  const [ready, setReady] = useState(false);

  const requestPermission = useCallback(async () => {
    setError(null);
    setReady(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('not_supported');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setReady(true);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('permission_denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('not_found');
      } else {
        setError('stream_failure');
      }
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setReady(false);
  }, []);

  useEffect(() => {
    return () => stopStream(); // cleanup wajib saat unmount
  }, [stopStream]);

  return { videoRef, error, ready, requestPermission, stopStream };
}
```

## 2. Pesan Error yang Human-Friendly (WAJIB, dilarang tampilkan raw JS error)

| `errorType` | Pesan ke user | Aksi tombol |
|---|---|---|
| `permission_denied` | "We need access to your camera to take your photos." | `[ Try Again ]` → panggil `requestPermission()` lagi |
| `not_found` | "We couldn't find a camera on this device." | `[ Try Again ]` |
| `not_supported` | "Your browser doesn't support camera access. Try a different browser." | tidak ada retry, sarankan browser lain |
| `stream_failure` | "Something went wrong starting your camera." | `[ Try Again ]` |

Komponen `<CameraErrorState errorType={error} onRetry={requestPermission} />` menampilkan mapping di atas.

## 3. Capture Frame ke Image

```typescript
// dipanggil setelah countdown selesai
function captureFrame(video: HTMLVideoElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d')!;

  // mirror horizontal agar hasil capture sesuai apa yang dilihat user di preview
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/jpeg', 0.92); // JPEG cukup untuk source, PNG dipakai di final export saja
}
```

## 4. `useCountdown()` Hook

```typescript
// lib/camera/useCountdown.ts
import { useState, useCallback, useRef } from 'react';

export function useCountdown(onComplete: () => void, from = 3, stepMs = 800) {
  const [count, setCount] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const start = useCallback(() => {
    let current = from;
    setCount(current);

    const tick = () => {
      current -= 1;
      if (current <= 0) {
        setCount(null);
        onComplete();
        return;
      }
      setCount(current);
      timerRef.current = setTimeout(tick, stepMs);
    };

    timerRef.current = setTimeout(tick, stepMs);
  }, [from, stepMs, onComplete]);

  return { count, start };
}
```

## 5. Alur Capture Loop (Screen 04) — Kontrak Orchestration

```typescript
// pseudocode di <CameraStage />
useEffect(() => {
  requestPermission();
}, []);

useEffect(() => {
  if (ready && currentPhotoIndex <= 5) {
    countdown.start();
  }
}, [ready, currentPhotoIndex]);

function handleCountdownComplete() {
  const dataUrl = captureFrame(videoRef.current!);
  triggerFlash();
  store.capturePhoto(dataUrl); // auto increment index & handle max 6 di store

  if (store.session.photos.length === 6) {
    stopStream();
    store.goToPhotoReview();
  }
  // else: useEffect di atas otomatis re-trigger countdown untuk foto berikutnya
}
```

## 6. Retake Flow

- User di `PHOTO_REVIEW` atau `EDITING` klik `<RetakeButton slotIndex={n} />`.
- Store: `retakePhoto(n)` → set status kembali ke `CAMERA_PERMISSION` dengan flag `retakeSlotIndex = n`.
- `<CameraStage />` mendeteksi mode retake: skip counter "1/6" biasa, tampilkan "Retake photo N", setelah capture selesai langsung kembali ke `PHOTO_REVIEW` (bukan lanjut ke foto berikutnya).

## 7. Cleanup Checklist (WAJIB diverifikasi agent sebelum menandai fase Camera selesai)

- [ ] `MediaStream` displanplaystop pada: unmount `<CameraStage />`, transisi ke screen lain, klik "Start New".
- [ ] Tidak ada `setTimeout`/`setInterval` countdown yang masih berjalan setelah komponen unmount (clear di `useEffect` cleanup).
- [ ] `videoRef.current.srcObject = null` setelah stop, agar tidak memory leak referensi stream lama.
# Task Breakdown — Fase Pengerjaan untuk Agent

**Aturan main untuk agent:** Kerjakan satu fase penuh sampai bisa dijalankan/diuji sebelum lanjut fase berikutnya. Jangan lompat fase. Setelah tiap fase, lakukan self-check terhadap checklist di bawah sebelum lanjut.

---

## FASE 0 — Project Bootstrap

- [ ] Setup Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- [ ] Setup Zustand.
- [ ] Setup Framer Motion.
- [ ] Buat struktur folder sesuai `02-TECH-SPEC.md` §1.
- [ ] Buat semua `types/index.ts` sesuai `02-TECH-SPEC.md` §2.
- [ ] Setup font editorial (Google Fonts sans-serif tipis, mis. `Inter` weight 300, atau `Instrument Sans`, atau serupa) via `next/font`.
- [ ] Pastikan `npm run dev` jalan dengan halaman kosong tanpa error.

## FASE 1 — UI Shell & Routing/State Flow

- [ ] Implementasi `lib/state/photoBoothStore.ts` (Zustand) sesuai kontrak di `03-STATE-MACHINE.md` §3.
- [ ] Implementasi `<AppShell />` + `<ScreenTransition />`.
- [ ] Implementasi Screen 01 (`<SetupScreen />`) lengkap dengan validasi.
- [ ] Implementasi Screen 02 (`<StripLayoutSelector />`) dengan data dummy dari `stripLayouts.ts`.
- [ ] Implementasi Screen 03 (`<PackSelector />`) dengan data dummy dari `stripPacks.ts` (boleh render pakai `<div>` styled dulu, canvas rendering nyata di Fase 4).
- [ ] Navigasi back/next berfungsi penuh antar 3 screen ini.
- [ ] **Test manual:** isi nama → pilih tema → pilih layout → pilih pack → state tersimpan benar (cek via devtools/log).

## FASE 2 — Camera & Photo Capture

- [ ] Implementasi `useCamera()` hook sesuai `08-CAMERA-MODULE.md` §1.
- [ ] Implementasi `useCountdown()` hook.
- [ ] Implementasi `<CameraStage />`, `<CameraCounter />`, `<Countdown />`, `<CaptureFlash />`, `<CameraErrorState />`.
- [ ] Implementasi capture loop penuh: countdown → capture → increment → ulang sampai 6 foto.
- [ ] Implementasi semua 4 error state kamera dengan pesan human-friendly.
- [ ] Implementasi cleanup MediaStream (checklist `08-CAMERA-MODULE.md` §7).
- [ ] **Test manual:** izinkan kamera → ambil 6 foto berturut-turut → foto tersimpan di store dengan urutan benar → stream berhenti otomatis setelah foto ke-6.

## FASE 3 — Photo Filtering / Effects (Assets Placeholder)

- [ ] Buat aset placeholder:
  - Minimal 6-8 filter (CSS-based, tidak perlu image asset, lihat `06-TEMPLATE-SYSTEM.md` §4).
  - Minimal 6 background options (boleh solid color placeholder dulu, `type: 'color'`).
  - Minimal 3-4 effect options (overlay PNG sederhana — boleh generate bentuk simpel: telinga kucing, kacamata, hati — pakai SVG/PNG buatan sendiri, bukan aset berhak cipta).
- [ ] Implementasi `<FilterCarousel />`, `<BackgroundCarousel />`, `<EffectCarousel />`, `<CircleThumbButton />`.
- [ ] Pasang carousel ini di `<CameraStage />` (live preview efek di video) DAN di `<PhotoEditor />` (efek diterapkan ke foto hasil capture).
- [ ] Implementasi Screen 05 (`<PhotoEditor />`) penuh: thumbnail strip, retake, pilih background/filter per foto.
- [ ] **Test manual:** tiap foto dari 6 foto bisa diberi filter berbeda-beda, retake salah satu foto tidak mengubah 5 foto lain.

## FASE 4 — Strip Template Engine

- [ ] Lengkapi `lib/templates/stripPacks.ts` dengan minimal 4 pack sesuai contoh di `06-TEMPLATE-SYSTEM.md` §2.
- [ ] Pastikan `<PackThumbnail />` di Screen 03 render preview asli dari data pack (bukan lagi placeholder div), gunakan canvas kecil atau render `renderStrip()` di resolusi mini.
- [ ] **Test manual:** tambah 1 pack baru ke array data → otomatis muncul di Screen 03 tanpa ubah kode komponen (verifikasi arsitektur data-driven bekerja).

## FASE 5 — Canvas Editor (Render Engine)

- [ ] Implementasi penuh `lib/canvas/renderStrip.ts` sesuai `07-CANVAS-RENDER-ENGINE.md` §3.
- [ ] Implementasi `computeSourceRect()`, `loadImage()` dengan cache, `drawFooter()`.
- [ ] Implementasi `<StripCanvasPreview />` dengan live re-render (debounced) saat data berubah.
- [ ] Implementasi Screen 06 (`<StripEditor />` mode composition) — grid foto kiri, canvas preview kanan.
- [ ] **Test manual:** ubah filter foto di Screen 05, kembali forward ke Screen 06 → strip preview reflect perubahan dengan benar. Ubah pack di Screen 03 (via back navigation) → strip preview berubah total sesuai pack baru.

## FASE 6 — Sticker + Drawing System

- [ ] Buat minimal 15-20 aset stiker placeholder (kategori: hearts, stars, flowers, characters, bows, sparkles, food, animals, shapes — minimal 2 per kategori). Boleh SVG sederhana buatan sendiri.
- [ ] Implementasi `<StickerPicker />`, `<StickerLayer />` (drag/scale/rotate/delete via DOM overlay + pointer events).
- [ ] Implementasi `<DrawingCanvas />` + `<DrawToolbar />` (warna, ketebalan, erase, clear all).
- [ ] Sinkronkan state sticker & drawing ke `renderStrip()` agar tampil di live preview & final export.
- [ ] Implementasi Screen 07 penuh, termasuk opsi skip.
- [ ] **Test manual:** tambah 3 stiker berbeda, drag-scale-rotate salah satu, gambar coretan bebas, hasil composite benar secara visual di preview.

## FASE 7 — Final Export

- [ ] Implementasi export resolusi tinggi (`scaleFactor = 3`) saat masuk `FINAL_RESULT`.
- [ ] Implementasi Screen 08 (`<FinalPreview />`) lengkap.
- [ ] Implementasi `downloadImage()` util.
- [ ] Implementasi tombol "Start New" → full reset sesuai `03-STATE-MACHINE.md` state RESET.
- [ ] **Test manual:** hasil PNG yang di-download beresolusi 900×3600 (atau sesuai layout), tajam, semua layer (foto+filter+stiker+gambar+footer) muncul benar.

## FASE 8 — Sharing

- [ ] Implementasi `lib/utils/share.ts` — Web Share API + fallback sesuai `04-SCREENS-SPEC.md` Screen 09.
- [ ] Implementasi `<ShareButton />` dengan gradient style Instagram-like (visual original, bukan logo resmi).
- [ ] **Test manual:** di device/browser yang support Web Share API (mis. mobile Chrome/Safari) → share sheet muncul. Di desktop browser tanpa support → fallback download + pesan muncul, TIDAK ada klaim sukses palsu.

## FASE 9 — Responsive Optimization

- [ ] Uji & perbaiki semua 9 screen di breakpoint: mobile (<640px), tablet (640-1024px), desktop (>1024px).
- [ ] Camera area mengisi viewport di mobile sesuai `02-TECH-SPEC.md`/PRD §5.
- [ ] Semua carousel horizontal scrollable dengan baik di touch device.
- [ ] Strip editor beralih dari 2-kolom (desktop) ke stack vertikal (mobile).

## FASE 10 — Performance & Bug Fixing

- [ ] Audit re-render berlebihan (React DevTools Profiler) — pastikan Zustand selector granular dipakai, bukan subscribe seluruh store di komponen besar.
- [ ] Audit memory leak: buka-tutup camera berkali-kali, pastikan tidak ada stream menumpuk (cek `chrome://webrtc-internals`).
- [ ] Audit object URL leak (`URL.revokeObjectURL` dipanggil).
- [ ] Jalankan seluruh checklist `11-ACCEPTANCE-CRITERIA.md` end-to-end tanpa error console.

## FASE 11 (Opsional/Enhancement — bukan syarat MVP)

- [ ] Face landmark tracking real-time (face-api.js/MediaPipe) untuk efek wajah yang mengikuti gerakan.
- [ ] IndexedDB untuk sesi foto besar agar tidak membebani memory di device rendah.
- [ ] Multi-bahasa (i18n).
# Acceptance Criteria — MVP Checklist

Proyek dianggap **selesai** hanya jika seluruh 25 kriteria di bawah ini lulus end-to-end dalam satu run tanpa reload halaman manual dan tanpa error di console.

- [ ] 1. User dapat memasukkan nama di Screen 01.
- [ ] 2. User dapat memilih warna tema (pink/biru) di Screen 01.
- [ ] 3. Tombol "ready ▷" berfungsi dan hanya aktif setelah nama+tema terisi.
- [ ] 4. User dapat memilih layout strip di Screen 02.
- [ ] 5. User dapat memilih frame pack di Screen 03.
- [ ] 6. Kamera browser terbuka dan meminta izin dengan benar.
- [ ] 7. User melihat live preview video (mirrored) di Screen 04.
- [ ] 8. Counter menampilkan `1 / 6` di awal sesi capture.
- [ ] 9. Countdown 3-2-1 berjalan sebelum tiap capture.
- [ ] 10. Foto berhasil di-capture dan tersimpan.
- [ ] 11. Counter bertambah setelah tiap capture (`2/6`, `3/6`, dst).
- [ ] 12. Enam foto berhasil di-capture berturut-turut sampai selesai otomatis.
- [ ] 13. User dapat mereview 6 foto di Screen 05 (thumbnail + preview besar).
- [ ] 14. User dapat memilih background untuk tiap foto.
- [ ] 15. User dapat menerapkan filter untuk tiap foto.
- [ ] 16. User dapat menerapkan efek wajah untuk tiap foto (minimal overlay statis).
- [ ] 17. User dapat memilih desain strip final (pack) — hasil pilihan Screen 03 terrefleksi.
- [ ] 18. Enam foto ter-composite ke dalam strip sesuai template pack terpilih.
- [ ] 19. User dapat menambahkan stiker ke strip (drag/scale/rotate/delete berfungsi).
- [ ] 20. User dapat menggambar bebas di atas strip (warna & ketebalan bisa diatur, bisa clear).
- [ ] 21. Strip final ter-update secara live setiap ada perubahan (foto/filter/stiker/gambar).
- [ ] 22. Layar hasil akhir menampilkan heading "ALL DONE ♡" dengan preview strip final.
- [ ] 23. File PNG resolusi tinggi (≥900×3600 atau proporsional) berhasil di-download.
- [ ] 24. Alur "Share to Instagram" tersedia — via Web Share API bila didukung, atau fallback download+pesan jujur bila tidak didukung (tanpa klaim sukses palsu).
- [ ] 25. Tombol "Start New" mereset seluruh sesi (nama, tema, layout, pack, foto, stiker, gambar) dan kembali ke Screen 01, dengan MediaStream & resource lama sudah di-cleanup.

## Kriteria Tambahan (Kualitas — direkomendasikan, tidak menghalangi rilis MVP tapi penting)

- [ ] Tidak ada error/warning di browser console selama seluruh alur.
- [ ] Tidak ada memory leak terdeteksi setelah 3x siklus penuh Setup→Share→Start New.
- [ ] Responsif berfungsi baik di 3 breakpoint (mobile/tablet/desktop) tanpa elemen terpotong/overflow.
- [ ] Visual style konsisten dengan prinsip minimal/editorial dari `01-PRD.md` §4 — tidak terlihat seperti dashboard SaaS di layar manapun.
- [ ] Menambah 1 strip pack baru ke data (`stripPacks.ts`) langsung muncul di UI tanpa mengubah kode komponen manapun (verifikasi arsitektur data-driven).
- [ ] Kamera & timer ter-cleanup dengan benar saat user berpindah screen di tengah proses capture (mis. browser back / klik logo/reset).
