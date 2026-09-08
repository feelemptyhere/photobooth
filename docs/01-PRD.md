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
