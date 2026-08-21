# Product Requirement Document (PRD)
## SIM Kinerja (Sistem Informasi Kinerja Pegawai)

---

## 1. Executive Summary & Goals
* **Nama Produk:** SIM Kinerja
* **Deskripsi:** Platform internal enterprise berbasis web untuk mengelola pengerjaan tugas divisi, pengukuran indikator kinerja (KPI), dan penilaian berkala pegawai secara terintegrasi.
* **Problem Statement:** Penugasan pegawai dan evaluasi kinerja saat ini masih dilakukan secara manual/terpisah, menyebabkan ketidaktransparanan KPI, pengumpulan tugas yang terlambat, serta kesulitan manajemen dalam memantau produktivitas harian/bulanan.
* **Tujuan Utama:**
  * Memusatkan seluruh alur Task Assignment & Submission dalam satu platform real-time.
  * Menyediakan kalkulasi skor KPI terotomatisasi berbasis bobot kriteria.
  * Menerapkan Granular Access Control berbasis peran (Role-Based Access Control / RBAC).

---

## 2. Product Architecture & Tech Stack

### 2.1 Technology Stack
* **Frontend:** Next.js 14+ (App Router, TypeScript, Tailwind CSS, React Query / SWR, Lucide Icons) — Port 3000
* **Backend API:** Laravel 11/13 (PHP 8.4) — Port 8000
* **Database:** PostgreSQL 16 — Port 5432
* **Authorization Package:** Spatie Laravel-Permission (v8+)
* **Authentication:** Laravel Sanctum (Stateful Domain / Bearer Token)
* **Infrastructure:** Podman & Podman-Compose (Containerized Microservices)

### 2.2 Backend Layered Architecture
Backend Laravel menerapkan pemisahan tanggung jawab (Separation of Concerns) yang ketat:

+--------------------------------------------------------+
| Routes & Middleware (Sanctum Auth + Spatie Permission) |
+---------------------------+----------------------------+
                            |
                            v
+--------------------------------------------------------+
| Controllers (Request Validation & HTTP Response Only)  |
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
| Policies (Authorization Checks via Spatie Traits)      |
+--------------------------------------------------------+

---

## 3. User Roles & Granular Permissions Matrix

Sistem memanfaatkan paket Spatie Laravel-Permission di backend untuk menerapkan Role-Based Access Control (RBAC) secara rinci:

| Module | Permission Name | Admin | Manager (Kadiv) | Employee |
| --- | --- | --- | --- | --- |
| User Management | users.manage | YES | NO | NO |
| Division | divisions.manage | YES | NO | NO |
| KPI Criteria | kpi.manage | YES | NO | NO |
| Task Assignment | tasks.create | YES | YES | NO |
| Task Assignment | tasks.view_all | YES | YES (Own Div) | NO |
| Task Submission | tasks.submit | NO | NO | YES |
| Task Review | tasks.review | YES | YES | NO |
| Performance Eval | evaluations.create | YES | YES | NO |
| Performance Eval | evaluations.view_own | YES | YES | YES |

### Deskripsi Hak Akses (Permissions)
1. **users.manage**: Membuat, mengedit, dan menghapus data akun pengguna/karyawan.
2. **divisions.manage & kpi.manage**: Mengatur struktur divisi serta indikator & bobot penilaian KPI.
3. **tasks.create**: Membuat dan mendistribusikan tugas baru ke pegawai.
4. **tasks.view_all**: Melihat daftar seluruh tugas (Admin melihat seluruh divisi, Manager melihat divisi sendiri).
5. **tasks.submit**: Mengunggah file/link bukti pengerjaan tugas.
6. **tasks.review**: Memeriksa, menyetujui (Approved), atau menolak (Rejected) tugas pengerjaan pegawai.
7. **evaluations.create & evaluations.view_own**: Menginput skor evaluasi bulanan (Manager/Admin) dan melihat kartu skor pribadi (Employee).

---

## 4. Entity Relationship Diagram (ERD) & Field-Level Specifications

### 4.1 Visual ERD (ASCII Schema)

+----------------------+       +----------------------+
|        users         |       |      divisions       |
+----------------------+       +----------------------+
| id (PK)              |  +--->| id (PK)              |
| name, email, pass    |  |    | name, code           |
+----------+-----------+  |    +----------------------+
           | 1            |
           |              | 1
           | 1            |
+----------v--------------+----+   +----------------------+
|      employees               |   |        tasks         |
+------------------------------+   +----------------------+
| id (PK)                      |   | id (PK)              |
| user_id (FK)                 |<--+-assigned_by (FK)     |
| division_id (FK)             |<--+-employee_id (FK)     |
| nip, position, phone         |   | title, status, points|
+----------+-------------------+   +----------+-----------+
           | 1                                | 1
           |                                  |
           | 1                                | 1..*
+----------v-------------------+   +----------v-----------+
| performance_evaluations      |   |   task_submissions   |
+------------------------------+   +----------------------+
| id (PK)                      |   | id (PK)              |
| employee_id (FK)             |   | task_id (FK)         |
| evaluator_id (FK)            |   | file_path, notes     |
| final_score, period          |   | status (Pending,...) |
+------------------------------+   +----------------------+

### 4.2 Data Dictionary (Field Details)

#### 1. users
* **id**: BIGINT (PK, Auto Increment)
* **name**: VARCHAR(255) (NotNull)
* **email**: VARCHAR(255) (Unique, NotNull)
* **password**: VARCHAR(255) (NotNull)
* **remember_token**: VARCHAR(100) (Nullable)
* **created_at**, **updated_at**: TIMESTAMP

#### 2. divisions
* **id**: BIGINT (PK, Auto Increment)
* **name**: VARCHAR(100) (NotNull)
* **code**: VARCHAR(20) (Unique, NotNull) — Contoh: DIV-IT, DIV-HR
* **description**: TEXT (Nullable)
* **created_at**, **updated_at**: TIMESTAMP

#### 3. employees
* **id**: BIGINT (PK, Auto Increment)
* **user_id**: BIGINT (FK -> users.id, Unique, NotNull)
* **division_id**: BIGINT (FK -> divisions.id, NotNull)
* **nip**: VARCHAR(50) (Unique, NotNull)
* **position**: VARCHAR(100) (NotNull) — Contoh: Senior Frontend Developer
* **phone**: VARCHAR(20) (Nullable)
* **created_at**, **updated_at**: TIMESTAMP

#### 4. tasks
* **id**: BIGINT (PK, Auto Increment)
* **assigned_by**: BIGINT (FK -> users.id, NotNull)
* **employee_id**: BIGINT (FK -> employees.id, NotNull)
* **title**: VARCHAR(255) (NotNull)
* **description**: TEXT (NotNull)
* **due_date**: DATETIME (NotNull)
* **priority**: ENUM('Low', 'Medium', 'High', 'Urgent') (Default: 'Medium')
* **weight_score**: INT (NotNull) — Bobot poin tugas (misal: 10 - 100)
* **status**: ENUM('Pending', 'In_Progress', 'Submitted', 'Approved', 'Rejected') (Default: 'Pending')
* **created_at**, **updated_at**: TIMESTAMP

#### 5. task_submissions
* **id**: BIGINT (PK, Auto Increment)
* **task_id**: BIGINT (FK -> tasks.id, NotNull)
* **submission_file**: VARCHAR(255) (Nullable) — Storage path
* **submission_link**: TEXT (Nullable) — URL repository/file
* **notes**: TEXT (Nullable)
* **reviewed_by**: BIGINT (FK -> users.id, Nullable)
* **review_notes**: TEXT (Nullable)
* **submitted_at**: TIMESTAMP (NotNull)
* **created_at**, **updated_at**: TIMESTAMP

#### 6. kpi_criterias
* **id**: BIGINT (PK, Auto Increment)
* **name**: VARCHAR(150) (NotNull) — Contoh: Kedisiplinan, Kualitas Kode
* **weight**: DECIMAL(5,2) (NotNull) — Persentase bobot (Contoh: 20.00)
* **description**: TEXT (Nullable)
* **created_at**, **updated_at**: TIMESTAMP

#### 7. performance_evaluations
* **id**: BIGINT (PK, Auto Increment)
* **employee_id**: BIGINT (FK -> employees.id, NotNull)
* **evaluator_id**: BIGINT (FK -> users.id, NotNull)
* **period_month**: INT (NotNull) — 1 hingga 12
* **period_year**: INT (NotNull) — Contoh: 2026
* **task_completion_score**: DECIMAL(5,2) (NotNull) — Nilai dari kalkulasi Tugas
* **kpi_score**: DECIMAL(5,2) (NotNull) — Nilai dari kriteria KPI
* **final_score**: DECIMAL(5,2) (NotNull) — Formula: (TaskScore * 0.6) + (KpiScore * 0.4)
* **grade**: ENUM('A', 'B', 'C', 'D', 'E') (NotNull)
* **notes**: TEXT (Nullable)
* **created_at**, **updated_at**: TIMESTAMP

---

## 5. API Endpoints Specification

### 5.1 Authentication (/api/v1/auth)
* **POST /login** — Authenticate user & return Sanctum Token.
* **POST /logout** — Revoke active token.
* **GET /me** — Get active authenticated user details & assigned Spatie roles/permissions.

### 5.2 Task Management (/api/v1/tasks)
* **GET /** — List tasks (Filtered by role, division, status, pagination).
* **POST /** — Create new task (tasks.create).
* **GET /{id}** — Get detail task with submissions history.
* **PUT /{id}** — Update task details.
* **DELETE /{id}** — Delete task.
* **POST /{id}/submit** — Submit task pengerjaan (tasks.submit, Multipart file/link).
* **POST /{id}/review** — Approve/Reject task submission (tasks.review).

### 5.3 Performance Evaluation (/api/v1/evaluations)
* **GET /** — List evaluations.
* **POST /** — Create monthly evaluation.
* **GET /employee/{employee_id}** — Get performance summary for specific employee.

---

## 6. Detailed Business Workflows & Step-by-Step

### 6.1 Alur Penugasan & Review Tugas (Task Lifecycle)

[Manager/Admin]               [Employee]                     [System]
       |                          |                             |
       +--- Create Task ----------+---------------------------->|
       |                          |                             +-- Save Task to DB
       |                          |<-- Notification Triggered --+
       |                          |                             |
       |                          +--- Upload Submission ------>|
       |                          |                             +-- Update Task Status -> "Submitted"
       |                          |                             +-- Calc Late Penalty if due_date passed
       |<-- Notification Trigger -+-----------------------------+
       |                          |                             |
       +--- Approve / Reject -----+---------------------------->|
                                  |                             +-- If Approved: Task Status -> "Approved"
                                  |                             +-- If Rejected: Task Status -> "Rejected"
                                  |<-- Notification Triggered --+

### 6.2 Alur Evaluasi Kinerja Bulanan (Monthly Performance Calculation)
1. System menarik seluruh tugas Approved milik Employee dalam bulan acuan.
2. Calculate Task Completion Rate Score (S_task):
   Task Score = (Total Approved Task Points / Total Assigned Task Points) * 100
3. Manager mengisi skor untuk tiap kriteria KPI (S_kpi).
4. Service Layer menghitung Final Score:
   Final Score = (TaskScore * 0.6) + (KpiScore * 0.4)
5. System menentukan Grade:
   * >= 85 -> A
   * 75 - 84.9 -> B
   * 65 - 74.9 -> C
   * 50 - 64.9 -> D
   * < 50 -> E

---

## 7. Acceptance Criteria (AC)

### AC-01: Task Creation & Assignment
* **GIVEN** Manager memegang role manager atau permission tasks.create.
* **WHEN** Manager mengirim request POST /api/v1/tasks dengan payload valid (employee_id, title, due_date, weight_score).
* **THEN** System menyimpan record tugas di database dengan status 'Pending' dan memicu notifikasi email/in-app ke Employee terkait.

### AC-02: Task Submission Overdue Handling
* **GIVEN** Employee melakukan pengumpulan tugas via POST /api/v1/tasks/{id}/submit.
* **WHEN** submitted_at melebihi timestamp due_date.
* **THEN** System tetap menerima file submission, namun memberi flag is_late = true dan memberikan potongan poin sebesar 10% pada weight_score tugas tersebut.

### AC-03: Restricted Role Access
* **GIVEN** User ber-role employee.
* **WHEN** User mencoba menembak endpoint POST /api/v1/evaluations.
* **THEN** System merespons dengan HTTP Status Code 403 Forbidden (User does not have the right permissions).

---

## 8. Notification System Specification

| Trigger Event | Recipient | Type | Content Template |
| --- | --- | --- | --- |
| New Task Assigned | Employee | In-App & Email | Tugas baru: '{task_title}' telah diberikan oleh {manager_name}. Deadline: {due_date}. |
| Task Submitted | Assigned Manager | In-App | {employee_name} telah mengumpulkan tugas '{task_title}'. Silakan lakukan review. |
| Task Reviewed | Employee | In-App & Email | Tugas '{task_title}' telah di-{status} oleh Manager. Catatan: {review_notes}. |
| Evaluation Published | Employee | Email | Hasil Evaluasi Kinerja Periode {month}/{year} Anda telah diterbitkan. Score: {final_score} ({grade}). |

---

## 9. Frontend Architecture Spec (Next.js 14 App Router)

### 9.1 Directory Structure
frontend/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx             # Sidebar + Navbar + Auth Guard
│   │   ├── page.tsx               # Analytics Overview
│   │   ├── tasks/
│   │   │   ├── page.tsx           # Task List Table / Kanban Board
│   │   │   └── [id]/page.tsx      # Task Detail & Submission Form
│   │   └── evaluations/
│   │       └── page.tsx           # Evaluation Scorecard
├── components/
│   ├── ui/                        # Reusable Primitive Components (Button, Input, Modal)
│   └── shared/                    # Sidebar, Navbar, RoleGuard Component
├── services/                      # Axios / Fetch API Client Integration
└── hooks/                         # Custom React Hooks (useAuth, useTasks)

### 9.2 State & Access Control Management
* **Authentication State:** Disimpan via React Context / Zustand yang di-hydrate dengan data GET /api/v1/auth/me.
* **Client-side Role Guard:** Menyiapkan komponen `<RoleGuard permission="tasks.create">` untuk menyembunyikan/menampilkan tombol aksi (Button/Modal) berdasarkan permission user.

---

## 10. Non-Functional Requirements (NFR)

* **Performance:** 
  * API Response Time < 200ms untuk 95% endpoint non-upload.
  * Next.js Frontend First Contentful Paint (FCP) < 1.2 detik.
* **Security:**
  * Password di-hash menggunakan Bcrypt (min cost factor: 12).
  * Perlindungan dari OWASP Top 10 (SQL Injection via Eloquent ORM, XSS Sanitization, CSRF Protection via Sanctum).
  * Rate Limiting pada API Authentication (Max 5 login attempts / min).
* **Reliability & Storage:**
  * Pengunggahan file bukti tugas dibatasi maks 10 MB per file (Format yang diizinkan: .pdf, .zip, .png, .jpeg).
  * Database dikonfigurasi dengan automated daily volume backup di container PostgreSQL.

---

## 11. MVP Feature Prioritization (P1 / P2 / P3)

       HIGH IMPACT
          │
          │  [P1] Authentication & Sanctum
          │  [P1] User & Division CRUD
          │  [P1] Basic Task Assignment & Submission
          │  [P1] Spatie RBAC Integration
          │
          │──────────────────────────────────────── [P2] Monthly Evaluation Score Calculation
          │                                         [P2] In-App Notification Engine
          │                                         [P2] Kanban Board View for Tasks
          │
          │                                                    [P3] Email Notification Queue
          │                                                    [P3] Export PDF Evaluation Report
          │                                                    [P3] Audit Logs Activity
          └─────────────────────────────────────────────────────────────────────────────────
          LOW COMPLEXITY                                                  HIGH COMPLEXITY

---

## 12. Development Roadmap & Phases

+----------------------------------------------------------------------------------------+
| Phase 1: Foundation Setup (Week 1)                                                     |
| - Finalize Database Migration & Spatie Roles Seeder                                    |
| - Configure Layered Architecture (Services, Repositories, Policies) in Laravel         |
| - Setup Next.js Boilerplate, Tailwind, and Axios Instance                              |
+-----------------------------------+----------------------------------------------------+
                                    |
                                    v
+----------------------------------------------------------------------------------------+
| Phase 2: Core Task System [P1] (Week 2 - 3)                                            |
| - Implement CRUD Task Assignment & File Submission APIs                                |
| - Build Next.js UI for Task Management & Submission Modal                              |
| - Connect Spatie Permissions with Middleware & Frontend RoleGuard                      |
+-----------------------------------+----------------------------------------------------+
                                    |
                                    v
+----------------------------------------------------------------------------------------+
| Phase 3: Evaluation Engine & Notifications [P2] (Week 4)                               |
| - Develop Performance Evaluation Score Calculation Service                             |
| - Implement In-App Notifications for Status Changes                                    |
| - Build Manager Evaluation Input Dashboard                                             |
+-----------------------------------+----------------------------------------------------+
                                    |
                                    v
+----------------------------------------------------------------------------------------+
| Phase 4: Polish, Testing & Deployment [P3] (Week 5)                                    |
| - End-to-End Testing (UAT & Integration Tests)                                         |
| - Optimize Dockerfile & Podman-Compose Production Configurations                       |
| - Final Documentation & Deployment                                                     |
+----------------------------------------------------------------------------------------+