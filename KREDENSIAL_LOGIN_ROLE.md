# 🔐 PANDUAN & KREDENSIAL LOGIN MULTI-ROLE (SPATIE RBAC)
**Performa.id — Central Saga Enterprise (SIM-KAP)**

Dokumen ini berisi panduan resmi kredensial login dan rincian hak akses untuk pengujian simulasi 3 role pada aplikasi **Performa.id**.

---

## 📍 URL Akses Aplikasi:
* **Halaman Login**: [http://localhost:3000/login](http://localhost:3000/login) *(atau [http://localhost:3001/login](http://localhost:3001/login))*
* **Backend API Server**: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)

---

## 1. 🛡️ Role: ADMINISTRATOR SYSTEM (ADMIN / HRD)

> **Aktor**: Administrator & Human Resources Department  
> **Tingkat Akses**: Full System Control (Akses Penuh 100%)

* 📧 **Email**: `admin@gmail.com`
* 🔒 **Password**: `password`
* 👤 **Nama Sesi**: `Admin System`
* 📋 **Tampilan Menu Sidebar (8 Menu)**:
  1. `Dashboard` (`/`)
  2. `Manajemen Tugas` (`/tasks`)
  3. `Evaluasi Kinerja` (`/evaluations`)
  4. `Master Divisi` (`/divisions`)
  5. `Kriteria KPI` (`/kpis`)
  6. `Manajemen User` (`/users`)
  7. `Audit Log` (`/activity-logs`)
  8. `Pengaturan` (`/settings`)
* ⚡ **Kemampuan Utama**:
  - Mengelola data user & mengubah role/permission Spatie RBAC.
  - Mengatur master data divisi dan persentase bobot KPI.
  - Mengunduh backup dump database PostgreSQL (`.sql`).
  - Melihat riwayat audit log aktivitas sistem.

---

## 2. 👔 Role: MANAGER UTAMA (MANAGER)

> **Aktor**: Manajer / Atasan / Kepala Divisi  
> **Tingkat Akses**: Operational & Reviewer Access

* 📧 **Email**: `manager@gmail.com`
* 🔒 **Password**: `password`
* 👤 **Nama Sesi**: `Manager Utama`
* 📋 **Tampilan Menu Sidebar (3 Menu Operasional Utama)**:
  1. `Dashboard` (`/`)
  2. `Manajemen Tugas` (`/tasks`)
  3. `Evaluasi Kinerja` (`/evaluations`)
* ⚡ **Kemampuan Utama**:
  - Membuat penugasan baru (*Create Task*) untuk staf dengan bobot 1–10 & deadline.
  - Meninjau (*Review*) bukti pekerjaan yang di-submit oleh karyawan (Setujui / Minta Revisi).
  - Mengisi slider penilaian kriteria KPI indikator (Kedisiplinan, Kualitas, Kerjasama, Inovasi).
  - Menerbitkan kartu skor evaluasi bulanan & mencetak laporan kinerja.

---

## 3. 👤 Role: KARYAWAN STAF (EMPLOYEE)

> **Aktor**: Karyawan / Staf Operasional  
> **Tingkat Akses**: Staff & Submission Access

* 📧 **Email**: `employee@gmail.com` *(atau `sarah@gmail.com`)*
* 🔒 **Password**: `password`
* 👤 **Nama Sesi**: `Sarah Jenkins`
* 📋 **Tampilan Menu Sidebar (3 Menu Staf Utama)**:
  1. `Dashboard` (`/`)
  2. `Manajemen Tugas` (`/tasks`)
  3. `Evaluasi Kinerja` (`/evaluations`)
* ⚡ **Kemampuan Utama**:
  - Melihat daftar tugas yang ditugaskan oleh atasan.
  - Mengirimkan (*Submit*) bukti penyelesaian kerja berupa **File Upload** atau **Link Google Drive**.
  - Melihat rekapitulasi skor kinerja & Grade personal (Grade A, B, C, D, E).

---

## 🔄 Alur Pengujian Pengujian Login (Step-by-Step)

1. Buka URL **[http://localhost:3000/login](http://localhost:3000/login)** di browser Anda.
2. Ketikkan Email `admin@gmail.com` & Password `password`, lalu klik **Masuk ke Dashboard**.
3. Amati sidebar bagian kiri: Tampil **8 Menu** lengkap.
4. Klik tombol **Keluar (Logout)** di bagian kiri bawah sidebar.
5. Ketikkan Email `manager@gmail.com` & Password `password`, lalu klik **Masuk ke Dashboard**.
6. Amati sidebar bagian kiri: Tampil **3 Menu Operasional** (Dashboard, Tugas, Evaluasi).
7. Klik **Keluar (Logout)** kembali.
8. Ketikkan Email `employee@gmail.com` & Password `password`, lalu klik **Masuk ke Dashboard**.
9. Amati sidebar bagian kiri: Tampil **3 Menu Staf** dengan tombol pengumpulan bukti tugas.
