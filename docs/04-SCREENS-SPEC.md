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
