PPDB Online - SMK Nusantara Mandiri
Website Penerimaan Peserta Didik Baru (PPDB) berbasis frontend murni dengan fitur pendaftaran online, cek status, dan panel admin.

Struktur File
ppdb-website/
├── index.html # Halaman utama / landing page
├── daftar.html # Formulir pendaftaran online
├── cek-status.html # Halaman cek status pendaftaran
├── admin.html # Panel admin (kelola pendaftar)
├── style.css # Seluruh styling (variabel, layout, responsif)
├── utils.js # Fungsi bersama (toast, localStorage helper)
├── app.js # Logika landing page (animasi, scroll, counter)
├── form.js # Logika formulir (validasi, upload, simpan data)
└── admin.js # Logika admin (login, CRUD, terima/tolak)

text


## Fitur

### Halaman Publik
- **Landing Page** — Hero animasi floating shapes, counter statistik, timeline alur pendaftaran, kartu jurusan dengan efek 3D tilt, persyaratan, FAQ accordion, CTA
- **Formulir Pendaftaran** — 17 field data diri, upload foto dengan preview, validasi real-time (NISN 10 digit, format HP, email, jurusan berbeda), nomor pendaftaran auto-generate
- **Cek Status** — Input nomor pendaftaran, tampilkan status (Menunggu/Diterima/Ditolak) beserta detail data

### Panel Admin
- Login dengan username & password
- Dashboard statistik (total, menunggu, diterima, ditolak)
- Tabel data pendaftar dengan foto, filter status, dan pencarian
- Modal detail pendaftar lengkap
- Tombol terima/tolak dengan konfirmasi dialog
- Toast notification untuk setiap aksi

### Animasi & UX
- `bounceIn` — elemen muncul dengan efek bounce (referensi flipaclip.com)
- `floatShape` — shapes di hero bergerak melayang
- Parallax mouse tracking pada hero
- 3D tilt effect pada kartu jurusan
- Scroll reveal (IntersectionObserver) dengan stagger delay
- Counter angka dengan easing
- Transisi halus pada hover, modal, dan toast
- Navbar transparan → blur glass on scroll

## Cara Menjalankan

1. Simpan semua file dalam satu folder
2. Buka `index.html` di browser (disarankan pakai **Live Server** di VS Code)
3. Tidak memerlukan server backend, build tool, atau instalasi apapun

## Akun Admin

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |

## Penyimpanan Data

Seluruh data pendaftar disimpan di **localStorage** browser. Artinya:

- Data hanya tersedia di browser dan perangkat yang sama
- Data akan hilang jika cache browser dibersihkan
- Cocok untuk **prototipe / demo**, bukan untuk production

Untuk production, localStorage perlu diganti dengan API backend (Node.js, PHP, dll).

## Teknologi

- **HTML5** — struktur semantik
- **CSS3** — custom properties, grid, flexbox, backdrop-filter, keyframe animations
- **Vanilla JavaScript** — tanpa framework, tanpa library
- **Google Fonts** — Nunito (display) + DM Sans (body)
- **Icon** — seluruh icon menggunakan inline SVG (tanpa dependency)

## Responsif

Mendukung 3 breakpoint:
- **Desktop** > 1024px
- **Tablet** 768px — 1024px
- **Mobile** < 768px (termasuk 480px)


## Fitur

### Halaman Publik
- **Landing Page** — Hero animasi floating shapes, counter statistik, timeline alur pendaftaran, kartu jurusan dengan efek 3D tilt, persyaratan, FAQ accordion, CTA
- **Formulir Pendaftaran** — 17 field data diri, upload foto dengan preview, validasi real-time (NISN 10 digit, format HP, email, jurusan berbeda), nomor pendaftaran auto-generate
- **Cek Status** — Input nomor pendaftaran, tampilkan status (Menunggu/Diterima/Ditolak) beserta detail data

### Panel Admin
- Login dengan username & password
- Dashboard statistik (total, menunggu, diterima, ditolak)
- Tabel data pendaftar dengan foto, filter status, dan pencarian
- Modal detail pendaftar lengkap
- Tombol terima/tolak dengan konfirmasi dialog
- Toast notification untuk setiap aksi

### Animasi & UX
- `bounceIn` — elemen muncul dengan efek bounce (referensi flipaclip.com)
- `floatShape` — shapes di hero bergerak melayang
- Parallax mouse tracking pada hero
- 3D tilt effect pada kartu jurusan
- Scroll reveal (IntersectionObserver) dengan stagger delay
- Counter angka dengan easing
- Transisi halus pada hover, modal, dan toast
- Navbar transparan → blur glass on scroll

## Cara Menjalankan

1. Simpan semua file dalam satu folder
2. Buka `index.html` di browser (disarankan pakai **Live Server** di VS Code)
3. Tidak memerlukan server backend, build tool, atau instalasi apapun

## Akun Admin

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |

## Penyimpanan Data

Seluruh data pendaftar disimpan di **localStorage** browser. Artinya:

- Data hanya tersedia di browser dan perangkat yang sama
- Data akan hilang jika cache browser dibersihkan
- Cocok untuk **prototipe / demo**, bukan untuk production

Untuk production, localStorage perlu diganti dengan API backend (Node.js, PHP, dll).

## Teknologi

- **HTML5** — struktur semantik
- **CSS3** — custom properties, grid, flexbox, backdrop-filter, keyframe animations
- **Vanilla JavaScript** — tanpa framework, tanpa library
- **Google Fonts** — Nunito (display) + DM Sans (body)
- **Icon** — seluruh icon menggunakan inline SVG (tanpa dependency)

## Responsif

Mendukung 3 breakpoint:
- **Desktop** > 1024px
- **Tablet** 768px — 1024px
- **Mobile** < 768px (termasuk 480px)

Singkatnya: 9 file, nol dependency, buka langsung di browser, semua data di localStorage.



