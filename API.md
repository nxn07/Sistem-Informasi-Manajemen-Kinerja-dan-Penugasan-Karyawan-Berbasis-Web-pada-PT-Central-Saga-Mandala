# 📋 Lembar Checklist & Eksekusi Pengujian API (SIM-KAP)

Dokumen ini digunakan sebagai panduan langkah-demi-langkah serta verifikasi hasil testing RESTful API pada Postman setelah perbaikan dan penambahan fitur baru (Issue #2 s/d #12).

---

## 🛠️ Persiapan Environment Postman

- [ ] Buat Environment: **`SIM-KAP Local`**
- [ ] Set variable `base_url` = `http://localhost:8000/api/v1`
- [ ] Set variable `token` = *(diisi otomatis atau manual setelah login)*
- [ ] Set Global Authorization pada Collection SIM-KAP:
  - **Type**: `Bearer Token`
  - **Token**: `{{token}}`

---

## 🧪 Matriks Skenario & Checklist Pengujian Lengkap

| Status | Modul / Isu Terkait | HTTP Method | Endpoint | Expected Status | Catatan / Hasil Uji |
| :---: | :--- | :---: | :--- | :---: | :--- |
| [ ] | **Auth** | `POST` | `/auth/login` | `200 OK` | Login berhasil & token Bearer terbit |
| [ ] | **Auth** | `GET` | `/auth/me` | `200 OK` | Mengembalikan profil user yang sedang login |
| [ ] | **Auth** | `POST` | `/auth/logout` | `200 OK` | Token dicabut/dihapus dari database |
| [ ] | **Roles (Issue #10)** | `POST` | `/roles` | `201 Created` | Membuat role baru (misal: HRD / STAFF) |
| [ ] | **Roles (Issue #10)** | `GET` | `/roles` | `200 OK` | Menampilkan seluruh list roles & permissions |
| [ ] | **Roles (Issue #10)** | `GET` | `/roles/{id}` | `200 OK` | Detail single role |
| [ ] | **Roles (Issue #10)** | `PUT` | `/roles/{id}` | `200 OK` | Update nama role / sync permissions |
| [ ] | **Roles (Issue #10)** | `DELETE` | `/roles/{id}` | `200 OK` | Hapus data role |
| [ ] | **Divisions** | `POST` | `/divisions` | `201 Created` | Menambahkan divisi baru |
| [ ] | **Divisions** | `GET` | `/divisions` | `200 OK` | Mengambil list divisi (Cache Redis) |
| [ ] | **Divisions** | `GET` | `/divisions/{id}` | `200 OK` | Detail single divisi |
| [ ] | **Divisions** | `PUT` | `/divisions/{id}` | `200 OK` | Update data divisi |
| [ ] | **Divisions** | `DELETE` | `/divisions/{id}` | `200 OK` | Hapus divisi |
| [ ] | **Users (Issue #8)** | `POST` | `/users` | `201 Created` | Tambah user baru (Admin Policy Check) |
| [ ] | **Users (Issue #8)** | `GET` | `/users` | `200 OK` | Menampilkan seluruh daftar user |
| [ ] | **Users (Issue #8)** | `GET` | `/users/{id}` | `200 OK` | Detail single user |
| [ ] | **Users (Issue #8)** | `PUT` | `/users/{id}` | `200 OK` | Update data user |
| [ ] | **Users (Issue #8)** | `DELETE` | `/users/{id}` | `200 OK` | Hapus data user |
| [ ] | **KPI** | `POST` | `/kpis` | `201 Created` | Membuat kriteria KPI baru |
| [ ] | **KPI** | `GET` | `/kpis` | `200 OK` | Menampilkan seluruh kriteria KPI |
| [ ] | **KPI** | `GET` | `/kpis/{id}` | `200 OK` | Detail single kriteria KPI |
| [ ] | **KPI** | `PUT` | `/kpis/{id}` | `200 OK` | Update kriteria KPI |
| [ ] | **KPI** | `DELETE` | `/kpis/{id}` | `200 OK` | Hapus kriteria KPI |
| [ ] | **Tasks (Issue #8 & #11)** | `POST` | `/tasks` | `201 Created` | Manager/Admin membuat task ke Employee |
| [ ] | **Tasks** | `GET` | `/tasks` | `200 OK` | Menampilkan list task (Cache Redis) |
| [ ] | **Tasks** | `GET` | `/tasks/{id}` | `200 OK` | Detail single task |
| [ ] | **Tasks (Issue #7 & #11)** | `POST` | `/tasks/{id}/submit` | `200 OK` | Employee upload bukti file (Public storage link) |
| [ ] | **Tasks (Issue #2, #5, #8)** | `POST` | `/tasks/{id}/review` | `200 OK` | Manager review task (Notes & UPPERCASE status) |
| [ ] | **Evaluations (Issue #4)** | `GET` | `/evaluations/me` | `200 OK` | Mengambil evaluasi pribadi milik employee aktif |
| [ ] | **Evaluations (Issue #3 & #6)** | `POST` | `/evaluations` | `201 Created` | FormRequest validasi & simpan `feedback_notes` |
| [ ] | **Evaluations** | `GET` | `/evaluations` | `200 OK` | Menampilkan seluruh rekap evaluasi |
| [ ] | **Evaluations** | `GET` | `/evaluations/{id}` | `200 OK` | Detail single evaluasi |
| [ ] | **Evaluations (Issue #6)** | `PUT` | `/evaluations/{id}` | `200 OK` | Update nilai / catatan evaluasi |
| [ ] | **Evaluations** | `DELETE` | `/evaluations/{id}` | `200 OK` | Hapus data evaluasi |
| [ ] | **Audit Log** | `GET` | `/activity-logs` | `200 OK` | Memeriksa log Spatie Activitylog |

---

## 📌 Log Catatan Tambahan Pengujian

- **Storage Upload Test**: Pastikan URL berkas submission yang dihasilkan bisa dibuka di browser tanpa error `404 Not Found`.
- **Policy Access Control Test**: Coba akses `POST /tasks` menggunakan token akun role `Employee` (Harus menghasilkan error `403 Forbidden`).