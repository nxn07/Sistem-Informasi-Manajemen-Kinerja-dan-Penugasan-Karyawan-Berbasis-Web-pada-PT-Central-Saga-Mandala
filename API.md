# 🚀 SIM-KAP API Documentation & RBAC Matrix

> **Sistem Informasi Manajemen Kinerja dan Penilaian (SIM-KAP)**  
> Dokumentasi Arsitektur API, Postman Collection, dan Matriks Hak Akses berbasis *Role-Based Access Control (RBAC)*.

---

## 🛡️ Matriks Hak Akses (Role & Permission)

| Module / Permission | Hak Akses Utama | 👑 Admin | 👔 Manager | 🧑‍💻 Employee |
| :--- | :--- | :---: | :---: | :---: |
| `users.manage` | Pengelolaan Pengguna | 🟢 | 🔴 | 🔴 |
| `divisions.manage` | Pengelolaan Divisi | 🟢 | 🔴 | 🔴 |
| `kpi.manage` | Indikator Kinerja (KPI) | 🟢 | 🟢 | 🔴 |
| `tasks.create` | Membuat & Edit Tugas | 🟢 | 🟢 | 🔴 |
| `tasks.view_all` | Monitoring Semua Tugas | 🟢 | 🟢 | 🔴 |
| `tasks.submit` | Pengumpulan Tugas | 🔴 | 🔴 | 🟢 |
| `tasks.review` | Penilaian & Feedback | 🟢 | 🟢 | 🔴 |
| `evaluations.create` | Penilaian Akhir (Evaluasi) | 🟢 | 🟢 | 🔴 |
| `evaluations.view_own` | Lihat Nilai Sendiri | 🔴 | 🔴 | 🟢 |

---

## 🗺️ Visual Postman Collection Map

```tree
📂 SIM-KAP (Collection)
├── 🔐 auth/
│   ├── 🔑 POST Test Login               ➔ {{base_url}}/auth/login
│   ├── 👤 GET  Get Profile              ➔ {{base_url}}/auth/me
│   └── 🚪 POST Logout                   ➔ {{base_url}}/auth/logout
│
├── 👥 users/                            [ 🏷️ Perm: users.manage ]
│   ├── 🟢 GET  Get All Users            ➔ {{base_url}}/users
│   ├── 🟡 POST Create User             ➔ {{base_url}}/users
│   ├── 🔵 GET  Get Single User          ➔ {{base_url}}/users/{id}
│   ├── 🟠 PUT  Update User              ➔ {{base_url}}/users/{id}
│   └── 🔴 DEL  Delete User              ➔ {{base_url}}/users/{id}
│
├── 🏢 divisions/                        [ 🏷️ Perm: divisions.manage ]
│   ├── 🟢 GET  Get All Divisions        ➔ {{base_url}}/divisions
│   ├── 🟡 POST Create Division         ➔ {{base_url}}/divisions
│   ├── 🔵 GET  Get Single Division      ➔ {{base_url}}/divisions/{id}
│   ├── 🟠 PUT  Update Division          ➔ {{base_url}}/divisions/{id}
│   └── 🔴 DEL  Delete Division         ➔ {{base_url}}/divisions/{id}
│
├── 📊 kpi/                              [ 🏷️ Perm: kpi.manage ]
│   ├── 🟢 GET  Get All KPIs             ➔ {{base_url}}/kpis
│   ├── 🟡 POST Create KPI              ➔ {{base_url}}/kpis
│   ├── 🔵 GET  Get Single KPI           ➔ {{base_url}}/kpis/{id}
│   ├── 🟠 PUT  Update KPI               ➔ {{base_url}}/kpis/{id}
│   └── 🔴 DEL  Delete KPI              ➔ {{base_url}}/kpis/{id}
│
├── 📋 tasks/                            [ 🏷️ Perm: tasks.* ]
│   ├── 🟢 GET  Get All Tasks            ➔ {{base_url}}/tasks          (tasks.view_all)
│   ├── 🟡 POST Create Task             ➔ {{base_url}}/tasks          (tasks.create)
│   ├── 🔵 GET  Get Single Task          ➔ {{base_url}}/tasks/{id}     (tasks.view_all)
│   ├── 📤 POST Submit Task             ➔ {{base_url}}/tasks/{id}/sub (tasks.submit)
│   ├── ⭐ POST Review Task             ➔ {{base_url}}/tasks/{id}/rev (tasks.review)
│   ├── 🟠 PUT  Update Task              ➔ {{base_url}}/tasks/{id}     (tasks.create)
│   └── 🔴 DEL  Delete Task             ➔ {{base_url}}/tasks/{id}     (tasks.create)
│
└── 🏅 evaluations/                      [ 🏷️ Perm: evaluations.* ]
    ├── 🟢 GET  Get All Evaluations      ➔ {{base_url}}/evaluations    (evaluations.create)
    ├── 🟡 POST Create Evaluation       ➔ {{base_url}}/evaluations    (evaluations.create)
    ├── 👤 GET  Get My Evaluation        ➔ {{base_url}}/evaluations/me (evaluations.view_own)
    └── 🔴 DEL  Delete Evaluation     ➔ {{base_url}}/evaluations/{id}