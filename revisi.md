# 🛠️ PELACAK PENYELESAIAN MASALAH & PENINGKATAN TEKNIS (SIM-KAP BATCH 2)
> **Repositori:** `Central-Saga/pedro`  
> **Status Pelacakan:** `[ 0 / 13 SELESAI ]`

---

## 📊 Matriks Status & Klasifikasi Isu (#13 - #25)

| No | Isu ID | Judul Masalah | Kategori | Tingkat Urgensi | Status |
| :-: | :---: | :--- | :---: | :---: | :---: |
| **1** | `#13` | Kolom `tasks.status` masih native Enum menolak status baru | Bug Fatal / Schema | 🚨 Critical | [ ] BELUM |
| **2** | `#15` | Role Mismatch `UPPERCASE` vs Seeder `lowercase` di `UserService` | Bug Fatal / Auth | 🚨 Critical | [ ] BELUM |
| **3** | `#22` | Permission Mismatch (Policy cek 15 granular vs Seeder 9 coarse) | Bug Fatal / Auth | 🚨 Critical | [ ] BELUM |
| **4** | `#14` | Kolom `submission_file` hilang di `$fillable` `TaskSubmission` | Data Integrity | ⚠️ High | [ ] BELUM |
| **5** | `#16` | Duplikasi file `RoleServiceInterface.php` di Repositories | Bug / Autoload | ⚠️ High | [ ] BELUM |
| **6** | `#23` | Route `/activity-logs` tanpa guard & Spatie middleware alias hilang | Security | ⚠️ High | [ ] BELUM |
| **7** | `#21` | `UserController` store/update tanpa `FormRequest` | Refactor / Validasi | ⚠️ High | [ ] BELUM |
| **8** | `#19` | `TaskController` belum sediakan method `update()` & `destroy()` | Feature / Route | ⚠️ High | [ ] BELUM |
| **9** | `#18` | `KPI` & `Division` bypass Repository-Service Pattern & FormRequest | Architecture | ⚠️ High | [ ] BELUM |
| **10** | `#20` | Resource Layer inkonsisten (Passthrough, N+1, missing `KpiResource`) | Architecture / API | 🟡 Medium | [ ] BELUM |
| **11** | `#17` | `TaskSubmissionService` tanpa interface & endpoint `/permissions` | Architecture / Feature | 🟡 Medium | [ ] BELUM |
| **12** | `#24` | Spatie MediaLibrary belum di-publish & implementasi `HasMedia` | Feature / Package | 🟡 Medium | [ ] BELUM |
| **13** | `#25` | Spatie ActivityLog belum aktif (trait `LogsActivity` & config) | Feature / Audit | 🟡 Medium | [ ] BELUM |

---

## 🗺️ Rencana Tahapan Eksekusi

```text
┌─────────────────────────────────────────────────────────────┐
│ FASE 1: PERBAIKAN SCHEMA DB, SEEDER & INKONSISTENSI KRITIKAL│
│ ├─ Issue #13: Ubah tipe kolom tasks.status jadi VARCHAR     │
│ ├─ Issue #14: Tambah submission_file ke $fillable           │
│ ├─ Issue #15: Harmonisasi Casing Role (admin/manager/karyawan)│
│ ├─ Issue #16: Hapus Duplikat RoleServiceInterface           │
│ └─ Issue #22: Lengkapi 15 Granular Permissions di Seeder   │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 2: KEAMANAN, MIDDLEWARE & STANDARISASI REQUEST/RESOURCE│
│ ├─ Issue #23: Register Spatie Middleware & Secure AuditLog  │
│ ├─ Issue #21: FormRequest untuk UserController              │
│ ├─ Issue #19: Lengkapi Task Update & Delete (Route/Request) │
│ └─ Issue #20: Rapikan Resource Layer & Buat KpiResource     │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 3: LAYER ARCHITECTURE & INTEGRASI FITUR SPATIE         │
│ ├─ Issue #18: Pola Repository-Service untuk Division & KPI  │
│ ├─ Issue #17: TaskSubmissionServiceInterface & /permissions │
│ ├─ Issue #24: Setup Spatie MediaLibrary (HasMedia)          │
│ └─ Issue #25: Setup Spatie ActivityLog (LogsActivity)       │
└─────────────────────────────────────────────────────────────┘