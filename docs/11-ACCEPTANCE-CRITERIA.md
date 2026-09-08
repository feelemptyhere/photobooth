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
