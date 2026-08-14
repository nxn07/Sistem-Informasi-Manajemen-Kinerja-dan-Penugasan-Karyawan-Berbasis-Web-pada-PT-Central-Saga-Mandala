# 🚀 SIM-KAP API Documentation, RBAC Matrix & Testing Guide

> **Sistem Informasi Manajemen Kinerja dan Penilaian (SIM-KAP)**  
> **Arsitektur:** Clean Architecture (*Service-Repository Pattern*), PostgreSQL, Redis Cache, Spatie Permission, Spatie Activitylog & Spatie Media Library.  
> **Base URL:** `http://localhost:8000/api` (atau via Postman Environment Variable: `{{base_url}}`)

---

## 🛡️ 1. Matriks Hak Akses (Role-Based Access Control)

| Module / Permission | Hak Akses Utama | 👑 Admin | 👔 Manager | 🧑‍💻 Employee | Catatan Otorisasi / Policy |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `auth.access` | Login, Profil, Logout | 🟢 | 🟢 | 🟢 | Sanctum Bearer Token |
| `users.manage` | Kelola Pengguna (CRUD) | 🟢 | 🔴 | 🔴 | `UserPolicy` |
| `divisions.manage` | Kelola Divisi (CUD) | 🟢 | 🔴 | 🔴 | `DivisionPolicy` + Cache Invalidation |
| `divisions.view` | Lihat Daftar Divisi | 🟢 | 🟢 | 🟢 | Redis Caching (`divisions_all`) |
| `kpi.manage` | Master Kriteria KPI | 🟢 | 🟢 | 🔴 | `KpiPolicy` |
| `tasks.create` | Buat & Edit Tugas | 🟢 | 🟢 | 🔴 | `TaskPolicy` (Manager divisi) |
| `tasks.view_all` | Monitoring Semua Tugas | 🟢 | 🟢 | 🔴 | Filter query & Cache |
| `tasks.view_assigned` | Lihat Tugas Sendiri | 🔴 | 🔴 | 🟢 | Scope `assigned_user_id` |
| `tasks.submit` | Pengumpulan Tugas | 🔴 | 🔴 | 🟢 | Spatie Media Library Upload |
| `tasks.review` | Penilaian & Feedback | 🟢 | 🟢 | 🔴 | `TaskPolicy::review` |
| `evaluations.manage`| Kelola Evaluasi Akhir | 🟢 | 🟢 | 🔴 | `EvaluationPolicy` |
| `evaluations.view_own`| Lihat Nilai Sendiri | 🔴 | 🔴 | 🟢 | Scope User ID |
| `activitylog.view` | Audit Trail Sistem | 🟢 | 🔴 | 🔴 | Spatie Activitylog Log Viewer |

---

## 🗺️ 2. Visual Postman Collection Map

```tree
📂 SIM-KAP (Collection)
├── 🔐 auth/
│   ├── 🔑 POST Login                        ➔ {{base_url}}/auth/login
│   ├── 👤 GET  Get Profile (Me)             ➔ {{base_url}}/auth/me
│   └── 🚪 POST Logout                       ➔ {{base_url}}/auth/logout
│
├── 🏢 divisions/                            [ ⚡ Cached via Redis ]
│   ├── 🟢 GET  Get All Divisions            ➔ {{base_url}}/divisions
│   ├── 🟡 POST Create Division              ➔ {{base_url}}/divisions
│   ├── 🔵 GET  Get Single Division          ➔ {{base_url}}/divisions/{id}
│   ├── 🟠 PUT  Update Division              ➔ {{base_url}}/divisions/{id}
│   └── 🔴 DEL  Delete Division              ➔ {{base_url}}/divisions/{id}
│
├── 👥 users/                                [ 🏷️ Perm: users.manage ]
│   ├── 🟢 GET  Get All Users                ➔ {{base_url}}/users
│   ├── 🟡 POST Create User                  ➔ {{base_url}}/users
│   ├── 🔵 GET  Get Single User              ➔ {{base_url}}/users/{id}
│   ├── 🟠 PUT  Update User                  ➔ {{base_url}}/users/{id}
│   └── 🔴 DEL  Delete User                  ➔ {{base_url}}/users/{id}
│
├── 📊 kpis/                                 [ 🏷️ Perm: kpi.manage ]
│   ├── 🟢 GET  Get All KPIs                 ➔ {{base_url}}/kpis
│   ├── 🟡 POST Create KPI                   ➔ {{base_url}}/kpis
│   ├── 🔵 GET  Get Single KPI               ➔ {{base_url}}/kpis/{id}
│   ├── 🟠 PUT  Update KPI                   ➔ {{base_url}}/kpis/{id}
│   └── 🔴 DEL  Delete KPI                   ➔ {{base_url}}/kpis/{id}
│
├── 📋 tasks/                                [ 🏷️ Perm: tasks.* ]
│   ├── 🟢 GET  Get All Tasks                ➔ {{base_url}}/tasks
│   ├── 🟡 POST Create Task                  ➔ {{base_url}}/tasks
│   ├── 🔵 GET  Get Single Task              ➔ {{base_url}}/tasks/{id}
│   ├── 📤 POST Submit Task (With Media)     ➔ {{base_url}}/tasks/{id}/submit
│   ├── ⭐ POST Review / Grade Task          ➔ {{base_url}}/tasks/{id}/review
│   ├── 🟠 PUT  Update Task                  ➔ {{base_url}}/tasks/{id}
│   └── 🔴 DEL  Delete Task                  ➔ {{base_url}}/tasks/{id}
│
├── 🏅 evaluations/                          [ 🏷️ Perm: evaluations.* ]
│   ├── 🟢 GET  Get All Evaluations          ➔ {{base_url}}/evaluations
│   ├── 🟡 POST Create Evaluation            ➔ {{base_url}}/evaluations
│   ├── 👤 GET  Get My Evaluation            ➔ {{base_url}}/evaluations/me
│   └── 🔴 DEL  Delete Evaluation            ➔ {{base_url}}/evaluations/{id}
│
└── 📜 audit-logs/                           [ 🛡️ Spatie Activitylog ]
    └── 🟢 GET  Get System Activity Logs     ➔ {{base_url}}/activity-logs