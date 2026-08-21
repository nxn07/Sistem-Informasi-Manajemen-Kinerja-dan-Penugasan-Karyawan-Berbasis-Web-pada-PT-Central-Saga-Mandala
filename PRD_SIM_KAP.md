# 📘 Product Requirement Document (PRD)
# SIM-KAP — Sistem Informasi Kinerja Pegawai

> **Versi:** 2.0 (Production Release)  
> **Tanggal:** 19 Agustus 2026  
> **Status:** 100% Production Ready  
> **Live Deployment:** [https://frontend-eight-jade-66.vercel.app](https://frontend-eight-jade-66.vercel.app)

---

## 1. Executive Summary & Core Objectives

### 1.1 Deskripsi Produk
**SIM-KAP (Sistem Informasi Kinerja Pegawai)** adalah platform enterprise berbasis web terintegrasi yang dirancang untuk mengelola penugasan tim harian/mingguan, melacak status pengumpulan tugas secara real-time, mengukur kriteria Indikator Kinerja Utama (KPI), serta menghitung skor dan grade evaluasi kinerja pegawai secara otomatis.

### 1.2 Problem Statement
Evaluasi kinerja pegawai pada organisasi enterprise sering kali terkendala akibat:
* Penugasan dan pengumpulan bukti kerja yang dilakukan secara manual/terpisah, memicu keterlambatan pengumpulan (overdue submission).
* Tidak adanya akumulasi otomatis skor kriteria KPI berbasis bobot persentase.
* Kurangnya transparansi hak akses antar jenjang jabatan (Admin, Manager, Pegawai).

### 1.3 Tujuan Utama (Product Goals)
1. **Centralized Task Management:** Memusatkan pendistribusian tugas, penentuan deadline, pengumpulan berkas bukti kerja, dan proses review atasan dalam satu tempat.
2. **Automated Monthly Evaluation Scorecard:** Menghitung nilai akhir kinerja pegawai secara presisi menggunakan formula pembobotan otomatis.
3. **Strict Granular Access Control:** Menerapkan kontrol akses berbasis peran (Role-Based Access Control / RBAC) menggunakan Spatie Laravel-Permission di backend dan komponen Guard di frontend.

---

## 2. Product Architecture & Technology Stack

### 2.1 Technology Stack

| Layer | Teknologi | Deskripsi |
| --- | --- | --- |
| **Frontend Framework** | Next.js 16 (App Router) | React Server & Client Components, TypeScript |
| **Styling & UI** | Tailwind CSS v4, Lucide Icons | Modern Glassmorphism, Responsive Grid System |
| **State & HTTP Client** | Axios Interceptors, React Hooks | Auth Bearer token injection & auto 401 redirect |
| **Validation & Forms** | Zod + React Hook Form | Schema validation untuk pembuatan & pengumpulan tugas |
| **Backend API** | Laravel 11 (PHP 8.2+) | Layered Architecture (Controller-Service-Repository) |
| **Authentication** | Laravel Sanctum | Stateful domain / Bearer Token auth |
| **Authorization** | Spatie Laravel-Permission v8 | Role & Granular Permission Management |
| **Database** | PostgreSQL 16 / MySQL | Database Relasional Utama |
| **Caching & Queue** | Redis | Caching query data master & antrean notifikasi |
| **Deployment** | Vercel & Docker Compose | Serverless Edge Deployment + Multi-stage Container |

### 2.2 Layered Architecture Pattern (Backend)

```text
+--------------------------------------------------------+
| HTTP Routes & Middleware (Sanctum Auth + Spatie Guard) |
+---------------------------+----------------------------+
                            |
                            v
+--------------------------------------------------------+
| Controllers (HTTP Request Validation & Response DTO)   |
+---------------------------+----------------------------+
                            |
                            v
+--------------------------------------------------------+
| Services Layer (Business Logic & Score Calculation)    |
+---------------------------+----------------------------+
                            |
                            v
+--------------------------------------------------------+
| Repositories Layer (PostgreSQL Query Abstraction)      |
+---------------------------+----------------------------+
                            |
                            v
+--------------------------------------------------------+
| Eloquent Models & Spatie Policies                      |
+--------------------------------------------------------+
```

---

## 3. User Roles & Granular Permission Matrix

Sistem membagi hak akses ke dalam 3 Role Utama:

| Permission Name | Module | Admin | Manager (Kadiv) | Employee |
| --- | --- | --- | --- | --- |
| `users.manage` | User Management | ✅ YES | ❌ NO | ❌ NO |
| `divisions.manage` | Division Management | ✅ YES | ❌ NO | ❌ NO |
| `kpi.manage` | KPI Criteria | ✅ YES | ❌ NO | ❌ NO |
| `tasks.create` | Task Assignment | ✅ YES | ✅ YES | ❌ NO |
| `tasks.view_all` | Task Monitoring | ✅ YES | ✅ YES (Divisi Sendiri) | ❌ NO |
| `tasks.submit` | Task Submission | ❌ NO | ❌ NO | ✅ YES |
| `tasks.review` | Task Review (Approve/Reject) | ✅ YES | ✅ YES | ❌ NO |
| `evaluations.create` | Monthly Evaluation | ✅ YES | ✅ YES | ❌ NO |
| `evaluations.view_own` | Evaluation Scorecard | ✅ YES | ✅ YES | ✅ YES |

---

## 4. Database ERD & Field-Level Specifications

### 4.1 Data Dictionary

#### 1. `users`
* `id`: BIGINT (PK, Auto Increment)
* `username`: VARCHAR(255) (NotNull)
* `email`: VARCHAR(255) (Unique, NotNull)
* `password`: VARCHAR(255) (NotNull, Hashed Bcrypt)
* `role`: ENUM('ADMIN', 'MANAGER', 'EMPLOYEE') (Default: 'EMPLOYEE')
* `created_at`, `updated_at`: TIMESTAMP

#### 2. `divisions`
* `id`: BIGINT (PK, Auto Increment)
* `code`: VARCHAR(20) (Unique, NotNull) — Contoh: `DIV-IT`, `DIV-HR`
* `name`: VARCHAR(100) (NotNull)
* `description`: TEXT (Nullable)
* `created_at`, `updated_at`: TIMESTAMP

#### 3. `employees`
* `id`: BIGINT (PK, Auto Increment)
* `user_id`: BIGINT (FK -> `users.id`, Unique, NotNull)
* `division_id`: BIGINT (FK -> `divisions.id`, NotNull)
* `nik`: VARCHAR(50) (Unique, NotNull)
* `full_name`: VARCHAR(255) (NotNull)
* `position`: VARCHAR(100) (NotNull) — Contoh: `Senior Backend Engineer`
* `phone`: VARCHAR(20) (Nullable)
* `created_at`, `updated_at`: TIMESTAMP

#### 4. `tasks`
* `id`: BIGINT (PK, Auto Increment)
* `created_by_manager_id`: BIGINT (FK -> `employees.id`, NotNull)
* `assigned_employee_id`: BIGINT (FK -> `employees.id`, NotNull)
* `title`: VARCHAR(255) (NotNull)
* `description`: TEXT (Nullable)
* `deadline`: DATETIME (NotNull)
* `weight`: INT (NotNull, Range: 1 - 10) — Bobot poin tugas
* `status`: ENUM('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'REJECTED', 'COMPLETED', 'REVISION')
* `created_at`, `updated_at`: TIMESTAMP

#### 5. `task_submissions`
* `id`: BIGINT (PK, Auto Increment)
* `task_id`: BIGINT (FK -> `tasks.id`, NotNull)
* `employee_id`: BIGINT (FK -> `employees.id`, NotNull)
* `file_path`: VARCHAR(255) (Nullable) — Path berkas PDF/Image
* `submission_link`: TEXT (Nullable) — Link URL hasil kerja (Google Drive/Figma/GitHub)
* `notes`: TEXT (Nullable)
* `reviewed_by_manager_id`: BIGINT (FK -> `employees.id`, Nullable)
* `review_notes`: TEXT (Nullable)
* `created_at`, `updated_at`: TIMESTAMP

#### 6. `kpi_criterias`
* `id`: BIGINT (PK, Auto Increment)
* `name`: VARCHAR(150) (NotNull) — Contoh: `Kedisiplinan & Ketepatan Waktu`
* `weight_percentage`: DECIMAL(5,2) (NotNull) — Bobot persentase (Target total: 100%)
* `description`: TEXT (Nullable)
* `created_at`, `updated_at`: TIMESTAMP

#### 7. `performance_evaluations`
* `id`: BIGINT (PK, Auto Increment)
* `task_id`: BIGINT (FK -> `tasks.id`, Nullable)
* `employee_id`: BIGINT (FK -> `employees.id`, NotNull)
* `evaluator_manager_id`: BIGINT (FK -> `employees.id`, NotNull)
* `kpi_criteria_id`: BIGINT (FK -> `kpi_criterias.id`, NotNull)
* `task_score`: DECIMAL(5,2) (NotNull) — Nilai akumulasi tugas (60%)
* `kpi_score`: DECIMAL(5,2) (NotNull) — Nilai kriteria KPI (40%)
* `final_score`: DECIMAL(5,2) (NotNull) — Formula: `(TaskScore * 0.6) + (KpiScore * 0.4)`
* `grade`: ENUM('A', 'B', 'C', 'D', 'E') (NotNull)
* `created_at`, `updated_at`: TIMESTAMP

---

## 5. Detailed Business Workflows & Evaluation Formulas

### 5.1 Alur Penugasan & Review (Task Lifecycle)

```text
[Manager / Admin]             [Pegawai / User]                [Backend & System]
        |                             |                                |
        +--- 1. Create Task --------->|                                |
        |    (Title, Weight, Deadline)|                                +-- Save Task -> Status: PENDING
        |                             |                                |
        |                             +--- 2. Update Progress -------->|
        |                             |    (Status -> IN_PROGRESS)     +-- Update Status -> IN_PROGRESS
        |                             |                                |
        |                             +--- 3. Submit Bukti Kerja ----->|
        |                             |    (File / URL Link / Notes)   +-- Save Submission -> Status: SUBMITTED
        |                             |                                |
        +--- 4. Review Submission ----+------------------------------->|
        |    (Approved / Revision)    |                                +-- If Approved: Status -> APPROVED
        |                             |                                +-- If Revision: Status -> REVISION
```

### 5.2 Formula Kalkulasi Evaluasi Kinerja Bulanan

Nilai Akhir Evaluasi Kinerja Pegawai dihitung secara otomatis oleh Service Layer dengan ketentuan:

$$\text{Final Score} = (\text{Task Score} \times 60\%) + (\text{KPI Score} \times 40\%)$$

#### Ketentuan Skala Grade:
* $\text{Final Score} \ge 85.00 \longrightarrow \mathbf{A}$ *(Sangat Memuaskan)*
* $75.00 \le \text{Final Score} < 85.00 \longrightarrow \mathbf{B}$ *(Baik)*
* $65.00 \le \text{Final Score} < 75.00 \longrightarrow \mathbf{C}$ *(Cukup)*
* $50.00 \le \text{Final Score} < 65.00 \longrightarrow \mathbf{D}$ *(Kurang)*
* $\text{Final Score} < 50.00 \longrightarrow \mathbf{E}$ *(Sangat Kurang)*

---

## 6. API Endpoints Specification

### 6.1 Authentication Module (`/api/v1/auth`)
* `POST /auth/login` — Autentikasi user & mengembalikan Sanctum Token.
* `POST /auth/logout` — Menghapus token aktif.
* `GET /auth/me` — Mengambil data profil user terotentikasi & daftar roles/permissions Spatie.

### 6.2 Task Management Module (`/api/v1/tasks`)
* `GET /tasks` — Mengambil daftar tugas (Filtered by Role, Division, Status, Search).
* `POST /tasks` — Membuat tugas baru (`tasks.create`).
* `GET /tasks/{id}` — Mengambil detail tugas & riwayat submission.
* `PUT /tasks/{id}` — Mengubah detail tugas.
* `DELETE /tasks/{id}` — Menghapus tugas (`tasks.create` / Admin/Manager).
* `POST /tasks/{id}/submit` — Mengumpulkan bukti kerja (`tasks.submit`).
* `POST /tasks/{id}/review` — Menyetujui atau meminta revisi tugas (`tasks.review`).

### 6.3 Evaluation & Master Data Modules
* `GET /evaluations` — Mengambil daftar scorecard evaluasi kinerja pegawai.
* `GET /divisions` — Mengambil daftar divisi perusahaan.
* `GET /kpis` — Mengambil kriteria & persentase bobot KPI.
* `GET /users` — Mengambil daftar akun pengguna & role RBAC.

---

## 7. Frontend Layout & Navigation Architecture

```text
frontend/
├── app/
│   ├── (auth)/
│   │   └── login/ ➔ page.tsx         # Halaman Autentikasi Login
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Shell Dashboard (Sidebar + Navbar + Auth Guard)
│   │   ├── tasks/ ➔ page.tsx         # Dashboard Tugas (Stats Cards + Search + Filter + Grid)
│   │   ├── evaluations/ ➔ page.tsx   # Scorecard Evaluasi Kinerja (Grade A-E)
│   │   ├── divisions/ ➔ page.tsx     # Master Data Divisi Perusahaan
│   │   ├── kpis/ ➔ page.tsx          # Master Kriteria & Bobot KPI
│   │   └── users/ ➔ page.tsx         # Management Pengguna & Spatie Roles
│   ├── error.tsx                     # Global Error Boundary
│   ├── loading.tsx                   # Global Loading Skeleton
│   └── not-found.tsx                 # Custom 404 Visual Page
├── components/
│   ├── ui/                           # Primitive UI Components (Modal, Card, Badges)
│   ├── shared/                       # Navbar, Sidebar, Can (Role Guard), FileUpload
│   └── tasks/                        # CreateTaskModal, SubmitTaskModal, ReviewTaskModal, TaskCardSkeleton
├── services/                         # Axios API Clients (auth-service, task-service, user-service)
├── hooks/                            # Custom React Hooks (useAuth, useTasks)
└── types/                            # TypeScript Data Contracts (api.ts)
```

---

## 8. Acceptance Criteria (AC)

### AC-01: Validasi Pembuatan Tugas
* **GIVEN** User memiliki role `ADMIN` atau `MANAGER`.
* **WHEN** User mengisi form buat tugas baru dengan data valid (Judul, Bobot 1-10, Pegawai Penanggung Jawab, Deadline).
* **THEN** Sistem menyimpan record tugas dengan status `PENDING` dan memperbarui daftar kartu tugas secara real-time.

### AC-02: Pengumpulan Bukti Kerja & Review
* **GIVEN** Pegawai membuka tugas berstatus `IN_PROGRESS` atau `PENDING`.
* **WHEN** Pegawai mengunggah berkas PDF/Image atau menyertakan link URL hasil kerja.
* **THEN** Status tugas berubah menjadi `SUBMITTED`, dan tombol `Review` aktif bagi Manager/Admin.

### AC-03: Restricted Access Guard (403 Forbidden)
* **GIVEN** User memiliki role `EMPLOYEE`.
* **WHEN** User mencoba menembak endpoint pembuatan tugas atau manajemen user.
* **THEN** Middleware Spatie menolak request dengan HTTP Status Code 403 Forbidden, dan frontend menyembunyikan elemen tombol aksi terkait.

---

## 9. Live Production Deployment Status

* **Status:** 100% Production Ready 🎉
* **Live Production URL:** [https://frontend-eight-jade-66.vercel.app](https://frontend-eight-jade-66.vercel.app)
* **Akun Demo Testing:**
  * **Email:** `admin@gmail.com`
  * **Password:** `password`
