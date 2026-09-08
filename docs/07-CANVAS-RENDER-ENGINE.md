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
