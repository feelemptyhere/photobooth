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
