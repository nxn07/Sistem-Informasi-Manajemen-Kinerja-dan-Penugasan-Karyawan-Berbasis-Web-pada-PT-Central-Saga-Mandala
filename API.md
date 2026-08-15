# 📋 Lembar Checklist & Eksekusi Pengujian API (SIM-KAP)

Dokumen ini digunakan sebagai panduan langkah-demi-langkah serta verifikasi hasil testing RESTful API pada Postman.

---

## 🛠️ Persiapan Environment Postman

- [ ] Buat Environment: **`SIM-KAP Local`**
- [ ] Set `base_url` = `http://localhost:8000/api/v1`
- [ ] Set Global Authorization pada Collection SIM-KAP:
  - **Type**: `Bearer Token`
  - **Token**: `{{token}}`

---

## 🧪 Matriks Skenario & Checklist Pengujian

| Status | Modul | HTTP Method | Endpoint | Expected Status | Catatan / Hasil Uji |
| :---: | :--- | :---: | :--- | :---: | :--- |
| [x] | **Auth** | `POST` | `/auth/login` | `200 OK` | Login berhasil & token terbit |
| [x] | **Auth** | `GET` | `/auth/me` | `200 OK` | Mengembalikan profil `Admin System` |
| [x] | **Auth** | `POST` | `/auth/logout` | `200 OK` | Token dicabut dari database |
| [x] | **Divisions** | `POST` | `/divisions` | `201 Created` | Menambahkan divisi baru (misal IT) |
| [x] | **Divisions** | `GET` | `/divisions` | `200 OK` | Mengambil seluruh list divisi (Redis) |
| [x] | **Divisions** | `GET` | `/divisions/{id}` | `200 OK` | Detail singl
 divisi |
| [x] | **Divisions** | `PUT` | `/divisions/{id}` | `200 OK` | Update data divisi |
| [x] | **Divisions** | `DELETE` | `/divisions/{id}` | `200 OK` | Hapus divisi |
| [x] | **Users** | `POST` | `/users` | `201 Created` | Tambah user role Employee |
| [x] | **Users** | `GET` | `/users` | `200 OK` | Menampilkan seluruh user |
| [x] | **Users** | `GET` | `/users/{id}` | `200 OK` | Detail single user |
| [x] | **Tasks** | `POST` | `/tasks` | `201 Created` | Manager membuat task ke Employee |
| [x] | **Tasks** | `GET` | `/tasks` | `200 OK` | Menampilkan seluruh task |
| [x] | **Tasks** | `POST` | `/tasks/{id}/submit` | `200 OK` | Upload bukti file via Spatie Media |
| [x] | **Tasks** | `POST` | `/tasks/{id}/review` | `200 OK` | Manager menilai task (Status: completed) |
| [x] | **KPI** | `POST` | `/kpis` | `201 Created` | Membuat target KPI baru |
| [x] | **KPI** | `GET` | `/kpis` | `200 OK` | Menampilkan seluruh target KPI |
| [x] | **Evaluations** | `POST` | `/evaluations` | `201 Created` | Membuat evaluasi kinerja |
| [x] | **Evaluations** | `GET` | `/evaluations` | `200 OK` | Menampilkan rekap evaluasi |
| [x] | **Audit Log** | `GET` | `/activity-logs` | `200 OK` | Memeriksa log Spatie Activitylog |

---

## 🔍 Detail Payload & Parameter Request

### 1. 🏢 Modul Divisi (`divisions/`)

#### 🟡 POST Create Division
* **URL**: `{{base_url}}/divisions`
* **Body (`raw` $\rightarrow$ `JSON`)**:
```json
{
  "name": "Divisi Teknologi Informasi",
  "code": "IT",
  "description": "Pengembangan perangkat lunak dan pemeliharaan infrastruktur"
}