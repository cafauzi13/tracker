# MyList — Tracker Mingguan (PWA)

Tracker checklist mingguan (jadwal kuliah, deadline, fokus harian, jangkar
ibadah/olahraga) — plain HTML/CSS/JS, tanpa framework atau build tool.
Bisa di-install ke home screen HP dan jalan 100% offline setelah dibuka
sekali secara online. **Semua isi pekan (jadwal, deadline, fokus, jangkar)
diedit langsung dari dalam app lewat tombol "✏️ Edit pekan" — tidak perlu
edit kode atau git push tiap minggu.**

## Isi folder

```
index.html      → aplikasi utama
manifest.json   → metadata PWA (nama, warna, ikon)
sw.js           → service worker (cache offline)
icons/          → ikon 192x192 & 512x512
README.md       → file ini
```

## 1. Deploy ke GitHub Pages

1. Buat repo baru di GitHub (public), misalnya `mylist`.
2. Push isi folder ini apa adanya ke branch `main` (struktur harus flat —
   `index.html` ada di root repo, bukan di dalam subfolder):
   ```bash
   git init
   git add .
   git commit -m "Initial PWA tracker"
   git branch -M main
   git remote add origin https://github.com/<username>/mylist.git
   git push -u origin main
   ```
3. Di GitHub: **Settings → Pages → Build and deployment → Source**, pilih
   **Deploy from a branch**, branch `main`, folder `/ (root)`. Simpan.
4. Tunggu 1–2 menit, link-nya muncul di halaman yang sama, formatnya:
   `https://<username>.github.io/mylist/`

## 2. Install ke HP (Add to Home Screen)

**Android (Chrome):**
1. Buka link GitHub Pages di atas lewat Chrome.
2. Ketuk menu titik tiga (⋮) di pojok kanan atas → **Add to Home screen** /
   **Install app**.
3. Konfirmasi nama "MyList" → **Install/Add**.
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

## 3. Edit jadwal — semuanya lewat UI, tanpa kode

Buka app, ketuk **"✏️ Edit pekan"** di bagian atas. Selama mode edit aktif:

- **Tiap hari** — di tab hari yang dibuka, kamu bisa tambah/edit/hapus baris
  **Kuliah**, **Agenda**, **Deadline**, dan **Fokus utama** langsung lewat
  input teks. Perubahan tersimpan otomatis (tidak ada tombol "Save"
  terpisah).
- **Label pekan & Jangkar harian** — ada di panel "Pengaturan pekan" (di
  atas tab hari), berlaku untuk semua hari di pekan itu.
- **"+ Pekan baru"** — pilih tanggal mulai, 7 hari otomatis dibuat
  (Senin–Minggu dari tanggal itu), jangkar harian disalin dari pekan yang
  sedang dibuka biar tidak perlu ketik ulang. Isi jadwalnya lewat mode edit
  seperti biasa.
- **"🗑 Hapus pekan ini"** — hanya aktif kalau ada lebih dari satu pekan
  tersimpan (supaya tidak pernah tersisa nol pekan). Catatan & status
  checklist per tanggal tidak ikut terhapus.

Ketuk **"✓ Selesai edit"** untuk kembali ke tampilan normal (checklist bisa
dicentang lagi).

> Dropdown **"Riwayat"** di sebelah tombol Edit dipakai untuk *melihat/
> mengedit* pekan-pekan yang sudah ada, termasuk pekan lampau.

### Kalau HP hilang / ganti perangkat / clear data browser

Semua data (jadwal, checklist, catatan) tersimpan di `localStorage` — hanya
ada di HP itu sendiri, tidak di-backup ke cloud manapun. Supaya tidak
kehilangan data:

- Di panel "Pengaturan pekan" (mode edit), ketuk **"⬇ Ekspor data"** untuk
  men-download file `.json` berisi seluruh jadwal + checklist + catatan.
  Simpan file ini di tempat aman (Drive/email ke diri sendiri/dsb),
  lakukan sesekali sebagai backup.
- Kalau perlu pulihkan, ketuk **"⬆ Impor data"** dan pilih file backup
  tadi — data akan ditimpa dari file itu lalu halaman dimuat ulang.

## 4. Riwayat pekan & catatan/diary

- Semua pekan yang pernah dibuat tersimpan permanen di `localStorage`
  (sampai kamu hapus manual lewat "🗑 Hapus pekan ini"). Buka dropdown
  **"Riwayat"** buat pindah lihat pekan lain — pekan yang mencakup tanggal
  hari ini otomatis ditandai "(pekan ini)".
- Tiap hari punya kotak **"Catatan, reminder & diary"** — bebas ditulis apa
  saja, tersimpan otomatis saat kamu mengetik, dan tetap ada meski jadwal
  pekan itu suatu saat dihapus (catatan disimpan per tanggal, terpisah dari
  data jadwal pekan).

## Catatan teknis

- Tidak ada dependency eksternal selain font dari Google Fonts (di-cache
  otomatis oleh service worker setelah load pertama).
- Semua penyimpanan pakai `localStorage` browser — sinkron, tidak butuh
  server/database eksternal, tapi juga berarti **tidak sinkron antar
  perangkat**. Kalau kamu pakai di HP dan laptop sekaligus, keduanya punya
  data terpisah (pakai fitur ekspor/impor di atas kalau perlu memindahkan
  data secara manual).
- Kalau mengubah `index.html`/`manifest.json`/`icons/`, naikkan angka versi
  cache di baris pertama `sw.js` (`const CACHE_NAME = 'mylist-v3';` →
  `v4`, dst.) supaya HP mengambil file baru, bukan versi lama dari cache.
- Blok `SEED_DAYS`/`SEED_ANCHORS` di awal `<script>` di `index.html` cuma
  dipakai sekali saat localStorage masih benar-benar kosong (instalasi
  pertama) — sesudah itu tidak dibaca lagi, semua pengeditan lewat UI.
