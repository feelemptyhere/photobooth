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
