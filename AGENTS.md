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

## Efisiensi Token (WAJIB — hemat token)

Token adalah resource terbatas. Dua mekanisme wajib dipakai sepanjang sesi untuk memangkas konsumsi token. **Pelanggaran aturan di bawah = pemborosan token yang tidak perlu dan wajib dihindari.**

### 1. Graphify — SATU-SATUNYA cara eksplorasi/pencarian kode

Knowledge graph proyek sudah dibangun di `graphify-out/graph.json` (code AST + 11 dokumen `docs/`). Setelah selesai satu fase atau commit besar, jalankan **`graphify update .`** (gratis, **no LLM**) supaya graph sinkron dengan kode terbaru — lakukan ini sebelum mulai eksplorasi di sesi baru.

**DILARANG KERAS** melakukan pencarian/eksplorasi kode dengan cara lain:
- ❌ `grep`, `rg`, `find`, `sed` manual di shell untuk mencari simbol/definisi/pemakaian
- ❌ `read_files` / membuka file mentah sekadar "untuk lihat apa isinya" atau mencari di mana suatu fungsi/komponen didefinisikan
- ❌ `search_codebase` (regex search) untuk mencari simbol/fungsi/komponen/definisi
- ❌ `fetch_web_content` untuk dokumentasi internal yang sudah ada di graph (seluruh `docs/*` sudah ter-indeks)

**WAJIB** lewat graphify untuk SEMUA kebutuhan berikut:
- Cari simbol / fungsi / komponen / tipe / definisi → `graphify query "<term>"`
- Pahami sebuah node + tetangga/dependency-nya → `graphify explain "<symbol>"`
- Trace hubungan / rantai dependency antar 2 simbol → `graphify path "A" "B"`
- Setelah fase/commit besar selesai → `graphify update .` (refresh graph, gratis)

**Pengecualian (boleh `read_files` langsung, bukan search):**
- Membaca file spesifik yang path-nya **sudah pasti diketahui** untuk diedit (mis. file yang sedang diimplementasi).
- Membaca `docs/*` saat onboarding awal sesuai urutan di tabel Dokumentasi (itu baca-membaca, bukan pencarian).
- Membaca `AGENTS.md` itu sendiri.

### 2. rtk — wajib dipakai untuk kompresi output shell

[**rtk**](https://github.com/rtk-ai/rtk) adalah CLI proxy (binary Rust tunggal, zero-dependency) yang memfilter & mengompresi output command shell **sebelum** masuk ke context LLM — memangkas konsumsi token **60–90%** pada command umum (`git`, `npm`, `cargo`, `tsc`, build/test output, dll; 100+ filter built-in).

**WAJIB:**
- rtk ter-install di environment kerja. Setup awal: `rtk init` (ikuti prompt, pilih agent hook yang sesuai). Cek status: `rtk status` / `rtk gain`.
- Semua command shell beroutput panjang (build, test, `git log`, `tsc --noEmit`, `npm run build`, dst.) **wajib** dijalankan dengan outputnya lewat proxy rtk agar ter-kompres sebelum sampai ke context.
- Pantau hemat token: `rtk gain` (estimasi token & USD tersimpan).

> Kedua aturan saling melengkapi: **graphify untuk eksplorasi/pencarian kode, rtk untuk kompresi output shell.** Tujuan sama: **hemat token, jangan boros.**

---

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
