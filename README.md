# SIM-KAP — Sistem Informasi Manajemen Kinerja dan Penugasan Karyawan

Aplikasi web untuk mengelola **penilaian kinerja karyawan berbasis bukti** pada PT Central Saga Mandala.
Manager memberi tugas, karyawan mengumpulkan bukti pekerjaan, manager menilai bukti **per aspek rubrik**,
lalu sistem menghitung nilai tugas, nilai KPI, dan nilai akhir secara transparan.

![Laravel](https://img.shields.io/badge/Laravel-13.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Podman](https://img.shields.io/badge/Podman-Compose-892CA0?style=for-the-badge&logo=podman&logoColor=white)

---

## ✨ Fitur

### Manajemen pengguna & hak akses
- **4 peran**: Master, Admin, Manager, Karyawan — dipisah tegas lewat RBAC (Spatie Permission + middleware).
- Master mengelola seluruh akun; Admin mengelola semua kecuali dirinya sendiri; Manager **hanya** karyawan di divisinya.
- Setiap halaman yang dibatasi peran dijaga di dua lapis: menu sidebar **dan** aturan rute (`ROLE_ONLY_PATHS`), karena menu bukan pengaman.

### Penugasan
- Manager membuat tugas: judul, arahan, tenggat, penerima, dan **beban kerja** (1–5) sebagai penanda, bukan pengali nilai.
- Satu tabel penugasan dengan status berkalimat: *Belum mulai · Menunggu ditinjau · Perlu diperbaiki · Selesai dinilai*.

### Bukti & penilaian per aspek
- Karyawan mengunggah bukti (berkas/gambar) beserta catatan.
- Manager menilai bukti memakai **rubrik 3 aspek**: Kelengkapan **40%**, Kualitas/Akurasi **35%**, Kesesuaian **25%**.
- Nilai tugas dihitung **di server**: `skor = kelengkapan×0,40 + kualitas×0,35 + kesesuaian×0,25`. Klien tidak boleh mengirim angka akhir.
- Nilai tugas **terkunci** setelah evaluasi periode itu dibuat — mencegah nilai berubah di belakang.

### Evaluasi KPI
- Kriteria KPI berbobot (contoh: Kualitas 30%, Kuantitas 25%, Ketepatan Waktu 25%, Kedisiplinan 20%).
- Capaian 0–100 diisi manual oleh penilai; bila kosong, sistem memakai capaian otomatis dari data operasional.
- `nilai_KPI = Σ(capaian × bobot) ÷ Σ bobot`.
- Satu evaluasi per karyawan per periode (`YYYY-MM`), dijaga unique index parsial.

### Nilai akhir & pelaporan
- `nilai_akhir = (nilai_tugas × 0,60) + (nilai_KPI × 0,40)`
- Grade: **A ≥ 85 · B ≥ 75 · C ≥ 65 · D ≥ 50 · E < 50**
- Rincian perhitungan menampilkan **nilai per bobot dan per aspek** dalam kalimat, bukan sekadar angka jadi.
- Audit log aktivitas, ekspor laporan.

---

## 🧱 Teknologi

| Lapisan | Teknologi |
|---|---|
| Backend | Laravel 13 (PHP 8.3), Sanctum, Spatie Permission, PHPUnit |
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind, BFF route handler |
| Database | PostgreSQL 16 |
| Cache/Queue | Redis 7 |
| Container | Podman + podman-compose (backend, worker, frontend, postgres, redis) |
| Uji | PHPUnit (backend) · Vitest (frontend) |

---

## 🚀 Cara Menjalankan

### Opsi A — Podman Compose (disarankan)

```bash
git clone https://github.com/nxn07/Sistem-Informasi-Manajemen-Kinerja-dan-Penugasan-Karyawan-Berbasis-Web-pada-PT-Central-Saga-Mandala.git
cd Sistem-Informasi-Manajemen-Kinerja-dan-Penugasan-Karyawan-Berbasis-Web-pada-PT-Central-Saga-Mandala

cp backend/.env.example backend/.env      # sesuaikan kredensial DB
podman-compose build
podman-compose up -d
podman-compose ps                          # pastikan semua service healthy
```

Akses: **http://localhost:3000** (web) · **http://localhost:8000/api/v1** (API) · `http://localhost:8000/api/health` (health check)

### Opsi B — Manual (tanpa container)

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000

# Frontend (terminal lain)
cd frontend
npm install
npm run dev
```

### Menjalankan pengujian

```bash
cd backend && php artisan test        # PHPUnit
cd frontend && npx vitest run         # Vitest
cd frontend && npx tsc --noEmit       # cek tipe
```

---

## 📁 Struktur Proyek

```text
.
├── backend/          # REST API Laravel (Controller tipis → Service → Repository)
│   ├── app/
│   │   ├── Http/Controllers/Api/V1/
│   │   ├── Services/        # NilaiTugasService, KpiAgregatService, PerformanceEvaluationService
│   │   ├── Policies/        # RBAC per resource
│   │   └── Support/         # RubrikTugas, KunciNilaiTugas
│   ├── database/migrations/
│   └── tests/Feature/
├── frontend/         # Next.js App Router + BFF (/api/*)
│   ├── app/(dashboard)/
│   ├── components/ui/
│   └── lib/services/        # semua pemanggilan API terpusat di sini
├── podman-compose.yml
└── docs/             # PRD, panduan penilaian, matriks RBAC
```

---

## 🔐 Catatan Keamanan

- Kredensial tidak boleh di-commit; gunakan `.env` lokal (sudah masuk `.gitignore`).
- Semua endpoint sensitif memakai middleware `auth:sanctum` + `role:...`.
- Nilai yang sudah dievaluasi tidak dapat diubah lewat API (dijaga `KunciNilaiTugas`).

---

## 👤 Penulis

**Pedrof Da Kristof** — mahasiswa ITB STIKOM Bali, program magang PT Central Saga Mandala.
