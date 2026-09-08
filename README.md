# MyList — Tracker Mingguan (PWA)

Tracker checklist mingguan (jadwal kuliah, deadline, fokus harian, jangkar ibadah/olahraga) — plain HTML/CSS/JS, tanpa framework atau build tool.
Bisa di-install ke home screen HP dan jalan 100% offline setelah dibuka sekali secara online.

## Isi folder

```
index.html      → aplikasi utama (edit DAYS/ANCHORS di sini tiap minggu)
manifest.json   → metadata PWA (nama, warna, ikon)
sw.js           → service worker (cache offline)
icons/          → ikon 192x192 & 512x512
README.md       → file ini
```

## 1. Deploy ke GitHub Pages

1. Buat repo baru di GitHub (public), misalnya `pekan-ini`.
2. Push isi folder ini apa adanya ke branch `main` (struktur harus flat —
   `index.html` ada di root repo, bukan di dalam subfolder):
   ```bash
   git init
   git add .
   git commit -m "Initial PWA tracker"
   git branch -M main
   git remote add origin https://github.com/<username>/pekan-ini.git
   git push -u origin main
   ```
3. Di GitHub: **Settings → Pages → Build and deployment → Source**, pilih
   **Deploy from a branch**, branch `main`, folder `/ (root)`. Simpan.
4. Tunggu 1–2 menit, link-nya muncul di halaman yang sama, formatnya:
   `https://<username>.github.io/pekan-ini/`

## 2. Install ke HP (Add to Home Screen)

**Android (Chrome):**
1. Buka link GitHub Pages di atas lewat Chrome.
2. Ketuk menu titik tiga (⋮) di pojok kanan atas → **Add to Home screen** /
   **Install app**.
3. Konfirmasi nama "Pekan Ini" → **Install/Add**.
4. Ikon muncul di home screen, buka seperti app biasa (tanpa address bar).

**iPhone (Safari):**
1. Buka link GitHub Pages di atas lewat Safari (bukan Chrome — di iOS harus
   Safari supaya opsi ini muncul).
2. Ketuk ikon **Share** (kotak dengan panah ke atas) di bar bawah.
3. Scroll, pilih **Add to Home Screen**.
4. Ketuk **Add** di pojok kanan atas.

Setelah ter-install dan dibuka minimal sekali saat online, app ini tetap
bisa dibuka penuh walau HP tidak ada koneksi sama sekali (service worker
sudah menyimpan semua file yang dibutuhkan).

## 3. Ganti data mingguan

Semua data yang perlu diedit tiap minggu ada dalam satu blok di
`index.html`, ditandai komentar:

```js
// ============================================================
// EDIT DI SINI TIAP MINGGU
// ============================================================
const WEEK_LABEL = "7 – 13 September 2026";
const DAYS = [ ... ];
const ANCHORS = [ ... ];
const todayId = "2026-09-07";
// ============================================================
```

Langkah tiap minggu:
1. Edit `WEEK_LABEL` (teks tanggal yang tampil di atas).
2. Edit array `DAYS` — tiap hari punya `id` (format `YYYY-MM-DD`, **harus
   unik dan berbeda dari minggu-minggu sebelumnya**, karena ini juga yang
   dipakai untuk menyimpan status checklist & catatan per tanggal),
   `label`, `date`, `kuliah`, `agenda`, `deadlines`, dan `focus`.
3. Edit `ANCHORS` kalau daftar jangkar harian berubah.
4. Update `todayId` sesuai tanggal hari pertama minggu berjalan (atau hari
   "hari ini" yang mau di-highlight saat app dibuka).
5. Commit & push:
   ```bash
   git add index.html
   git commit -m "Update jadwal minggu ini"
   git push
   ```
6. Buka lagi app-nya di HP (refresh / buka ulang). Minggu sebelumnya
   otomatis tersimpan sebagai riwayat — tidak hilang walau `DAYS` ditimpa.

> Kalau ada perubahan pada `index.html`, `manifest.json`, atau file di
> `icons/`, naikkan angka versi cache di baris pertama `sw.js`
> (`const CACHE_NAME = 'pekan-ini-v1';` → `v2`, dst.) supaya HP mengambil
> file baru, bukan versi lama dari cache.

## 4. Riwayat pekan, catatan & diary (disimpan di HP)

- Setiap kali app dibuka, jadwal minggu yang sedang aktif otomatis
  "difoto" dan disimpan sebagai riwayat di `localStorage` HP kamu.
- Kalau ada lebih dari satu minggu tersimpan, dropdown **"Riwayat"** di
  atas progress bar akan muncul — pilih minggu lama untuk melihat
  checklist & catatan minggu itu lagi.
- Tiap hari punya kotak **"Catatan, reminder & diary"** di bagian bawah —
  bebas ditulis apa saja (pengingat, jurnal harian, dll), tersimpan
  otomatis saat kamu mengetik.
- Semua data (checklist, catatan, riwayat minggu) tersimpan **hanya di
  browser/perangkat itu** (localStorage), tidak disinkronkan ke perangkat
  lain atau ke cloud manapun. Kalau kamu clear data browser / pindah HP /
  install ulang, riwayatnya akan hilang — ini bukan database server,
  cukup untuk pemakaian personal di satu perangkat.

## Catatan teknis

- Tidak ada dependency eksternal selain font dari Google Fonts (di-cache
  otomatis oleh service worker setelah load pertama).
- Semua penyimpanan pakai `localStorage` browser (sinkron, tidak perlu
  `await`), menggantikan `window.storage` yang sebelumnya hanya tersedia
  di lingkungan artifact Claude.ai.
