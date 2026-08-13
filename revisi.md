# 📋 DAFTAR REVISI & PEKERJAAN RUMAH (PR) — SIM-KAP BACKEND
> **Proyek:** SIM-KAP Backend (Laravel Architecture)  
> **Standar Arsitektur:** Repository & Service Pattern (Interface-Driven Abstraction)  
> **Database:** PostgreSQL Compatible  
> **Status Keseluruhan:** `[ ON PROGRESS ]`

---

## 📊 Summary Dashboard Progress

| No | Modul Pekerjaan | Status | Coverage | Catatan Eksekusi |
| :-: | :--- | :-: | :-: | :--- |
| **1** | **Database, Factories & Seeders** | `[ 100% DONE ]` | 7 Models | Full Seeder & Factory support (PostgreSQL Uppercase Constraints) |
| **2** | **Repository & Service Layer** | `[ 100% DONE ]` | 4 Core Modules | Clean Interface Abstraction & Container Binding via `AppServiceProvider` |
| **3** | **Controller, API Resources & Error Handling** | `[ READY TO EXECUTE ]` | All Endpoints | Clean Controller, API Resources, & Robust Exception Handling |
| **4** | **Otorisasi (Policies & Spatie Permissions)** | `[ PENDING ]` | Role Based | Policy enforcement di layer HTTP & Spatie Permission integration |
| **5** | **Integrasi Media Library & Activity Log** | `[ PENDING ]` | Audit & Media | Spatie Media Library & Activitylog (Audit Trail) |
| **6** | **Optimasi Performa (Redis & Caching)** | `[ PENDING ]` | Service Layer | Redis Caching (Read Query) & Cache Flush Strategy (Write) |

---

## 📌 Status Checklist Pengerjaan

### 1. Database, Factories & Seeders
- [x] **Buat file Factory untuk SEMUA Model tanpa terkecuali:**
  - [x] `UserFactory`
  - [x] `EmployeeFactory`
  - [x] `DivisionFactory`
  - [x] `TaskFactory`
  - [x] `TaskSubmissionFactory`
  - [x] `KpiCriteriaFactory`
  - [x] `PerformanceEvaluationFactory`
- [x] **DatabaseSeeder Alignment:**
  - [x] Sesuaikan `DatabaseSeeder` agar pembuatan data *dummy* menggunakan Factory jumlahnya konsisten dan presisi antar Model yang saling berelasi.

---

### 2. Arsitektur Repository & Service Layer (Interface Pattern)
- [x] **Interface Abstraction:**
  - [x] Terapkan Interface Abstraction untuk seluruh Repository & Service.
- [x] **1 Model = 1 Repository + 1 Service + 1 Interface:**
  - [x] `UserRepositoryInterface` & `UserRepository` ↔ `UserServiceInterface` & `UserService`
  - [x] `EmployeeRepositoryInterface` & `EmployeeRepository` ↔ `EmployeeServiceInterface` & `EmployeeService`
  - [x] `TaskRepositoryInterface` & `TaskRepository` ↔ `TaskServiceInterface` & `TaskService`
  - [x] `EvaluationRepositoryInterface` & `EvaluationRepository` ↔ `EvaluationServiceInterface` & `EvaluationService`
- [x] **Dependency Injection Binding:**
  - [x] Registrasikan seluruh *binding* Interface ke Class konkret di `AppServiceProvider.php`.

---

### 3. Controller, API Resources & Error Handling
- [ ] **API Resource per Model:**
  - [ ] `UserResource`
  - [ ] `EmployeeResource`
  - [ ] `DivisionResource`
  - [ ] `TaskResource`
  - [ ] `TaskSubmissionResource`
  - [ ] `PerformanceEvaluationResource`
- [ ] **Robust Error Handling:**
  - [ ] Tambahkan penanganan error (`try-catch` & Custom Exception Handling) di Controller/Service yang mengembalikan notifikasi/pesan error JSON yang jelas dan spesifik saat gagal.

---

### 4. Otorisasi (Policies & Spatie Permissions)
- [ ] **Spatie Permission Enforcement:**
  - [ ] Eksekusi dan terapkan Spatie Permission secara penuh di seluruh endpoint API.
- [ ] **HTTP / Controller Policy:**
  - [ ] Buat dan terapkan Laravel Policy di Layer HTTP/Controller untuk mengontrol hak akses (`view`, `create`, `update`, `delete`) pada setiap modul:
    - [ ] `TaskPolicy`
    - [ ] `EvaluationPolicy`
    - [ ] `EmployeePolicy`

---

### 5. Integrasi Media Library & Activity Log (Spatie)
- [ ] **Spatie Media Library Integration:**
  - [ ] Terapkan Spatie Media Library (`HasMedia` & `InteractsWithMedia`) untuk pengelolaan file media pada:
    - [ ] Modul Task / Task Submission
    - [ ] Modul Evaluasi / Performance Evaluation
- [ ] **Spatie Activitylog (Audit Trail):**
  - [ ] Pasang Spatie Activitylog pada Model-Model utama untuk mencatat jejak digital setiap ada aktivitas tambah, ubah, atau hapus data.

---

### 6. Optimasi Performa (Redis & Caching)
- [ ] **Redis & Caching Strategy:**
  - [ ] Terapkan Redis & Caching di SELURUH Service Layer:
    - [ ] Lakukan **Caching** pada query pembacaan data (`GET` / Read).
    - [ ] Lakukan **Flush / Clear Cache** saat ada perubahan data (`POST`/`PUT`/`DELETE` / Write).

---

## 🌳 Structure Tree Modul Terimplementasi (Poin 1 & 2)

```text
backend/
├── app/
│   ├── Providers/
│   │   └── AppServiceProvider.php          <-- Container Dependency Injection
│   │
│   ├── Repositories/
│   │   ├── Contracts/                      <-- Repository Interfaces
│   │   │   ├── UserRepositoryInterface.php
│   │   │   ├── EmployeeRepositoryInterface.php
│   │   │   ├── TaskRepositoryInterface.php
│   │   │   └── EvaluationRepositoryInterface.php
│   │   │
│   │   └── Eloquent/                       <-- Eloquent Implementations
│   │       ├── UserRepository.php
│   │       ├── EmployeeRepository.php
│   │       ├── TaskRepository.php
│   │       └── EvaluationRepository.php
│   │
│   └── Services/
│       ├── Contracts/                      <-- Business Service Interfaces
│       │   ├── UserServiceInterface.php
│       │   ├── EmployeeServiceInterface.php
│       │   ├── TaskServiceInterface.php
│       │   └── EvaluationServiceInterface.php
│       │
│       ├── UserService.php                 <-- Business Logic Services
│       ├── EmployeeService.php
│       ├── TaskService.php (Termasuk transaksi penalti & PostgreSQL UPPERCASE status)
│       └── EvaluationService.php