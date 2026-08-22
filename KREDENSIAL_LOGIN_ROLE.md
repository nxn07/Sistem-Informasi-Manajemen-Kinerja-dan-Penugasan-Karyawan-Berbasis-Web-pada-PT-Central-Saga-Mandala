# 🔐 DOKUMEN HAK AKSES SPATIE RBAC & KREDENSIAL LOGIN LENGKAP
**Central Saga Enterprise Performance (SIM-KAP v2.0 Official)**

> [!NOTE]
> Dokumen resmi ini berisi rincian kredensial login seluruh peranan (*Roles* & *User Accounts*), status keaktifan akun, matriks hak akses **Spatie RBAC**, fitur pemindahan tugas pegawai non-aktif (*Task Reassignment Engine*), Tempat Sampah (*Recycle Bin Recovery*), serta panduan alur kerja operasional (*SOP Workflow*) pada sistem **Central Saga**.

---

## 📍 1. URL Akses Sistem

* **Halaman Login**: [http://localhost:3000/login](http://localhost:3000/login)
* **Reset Password**: [http://localhost:3000/reset-password](http://localhost:3000/reset-password)
* **Dashboard Utama**: [http://localhost:3000](http://localhost:3000)
* **Manajemen Tugas & Tempat Sampah**: [http://localhost:3000/tasks](http://localhost:3000/tasks)
* **Evaluasi Kinerja KPI**: [http://localhost:3000/evaluations](http://localhost:3000/evaluations)
* **Manajemen User & RBAC**: [http://localhost:3000/users](http://localhost:3000/users)
* **Log Aktivitas System**: [http://localhost:3000/activity-logs](http://localhost:3000/activity-logs)
* **Pengaturan Profile & Sistem**: [http://localhost:3000/settings](http://localhost:3000/settings)
* **Backend API Server**: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)

---

## ⚡ 2. Ringkasan Cepat Email & Password Login Seluruh User (Siap Copy-Paste)

> [!TIP]
> **Password Bawaan Seluruh Akun**: `password`  
> *(Catatan: Password dapat diubah secara mandiri melalui menu [Reset Password](http://localhost:3000/reset-password) dengan konfirmasi OTP ke email testing default `putra.timur804@gmail.com` atau via Tab Profil Saya di Pengaturan)*

| ID | Role / Level Akses | Nama Pengguna | Email Login | Password Bawaan | Status Akun | Jabatan / Peran Spatie RBAC |
|:--:|:---|:---|:---|:---|:---:|:---|
| 07 | 👑 **Super Admin** | Admin System | `admin@gmail.com` | `password` | 🟢 AKTIF | Super Admin & Pengelola Spatie RBAC |
| 06 | 👔 **Manager 1** | Manager Utama | `manager@gmail.com` | `password` | 🟢 AKTIF | Senior General Manager |
| 08 | 👔 **Manager 2** | Manager Operasional | `manager2@gmail.com` | `password` | 🟢 AKTIF | Operations Manager |
| 01 | 👤 **Employee 1** | Sarah Jenkins | `sarah@gmail.com` | `password` | 🟢 AKTIF | Finance Specialist |
| 02 | 👤 **Employee 2** | Michael Ross | `michael@gmail.com` | `password` | 🟢 AKTIF | IT Operations Lead |
| 03 | 👤 **Employee 3** | Natalie McDermott | `natalie@gmail.com` | `password` | 🟢 AKTIF | HR Specialist |
| 04 | 👤 **Employee 4** | Van Larkin | `van@gmail.com` | `password` | 🟢 AKTIF | Legal Counsel |
| 05 | 👤 **Employee 5** | Miss Felicity Runte | `felicity@gmail.com` | `password` | 🟢 AKTIF | Staff Specialist |
| 09 | 👤 **Employee 6** | Bertrand | `bertrand@gmail.com` | `password` | 🟢 AKTIF | Operations Staff |
| 10 | 👤 **Employee 7** | Anna Lee | `anna@gmail.com` | `password` | 🟢 AKTIF | Marketing Officer |
| 11 | 👤 **Employee 8** | David Tran | `david@gmail.com` | `password` | 🟢 AKTIF | Software Engineer |
| * | 👤 **User Baru** | *(User Terdaftar)* | `<email_user>` | `password` | 🟢 AKTIF | Karyawan / Staf Terdaftar |

---

## 🔑 3. Detail Rincian Hak Akses & Fitur Per Role

### A. Role Management (Atasan & Pengelola Sistem)

| No | Peran (Role) | Email Login | Password | Nama Pengguna | Izin Akses Spesifik (Spatie RBAC Permissions) | Akses Fitur Utama |
|:--:|:---|:---|:---|:---|:---|:---|
| 1 | 👑 **ADMIN** | `admin@gmail.com` | `password` | Admin System | `tasks.create`, `tasks.submit`, `tasks.review`, `users.manage`, `users.delete`, `evaluations.create`, `divisions.manage` (Full `*`) | **Full Super Admin**: Kelola User, Status Keaktifan, Edit Spatie RBAC, Pindahkan Tugas, Tempat Sampah & Permanent Delete, Master Divisi, KPI Criteria, Log Aktivitas |
| 2 | 👔 **MANAGER 1** | `manager@gmail.com` | `password` | Manager Utama | `tasks.create`, `tasks.submit`, `tasks.review`, `evaluations.create`, `users.delete` | **Akses Manager**: Assign Tugas Baru, Pindahkan Tugas Non-Aktif, Submit Bukti, Review & Persetujuan, Tempat Sampah (Recycle Bin), Evaluasi KPI Bulanan |
| 3 | 👔 **MANAGER 2** | `manager2@gmail.com` | `password` | Manager Operasional | `tasks.create`, `tasks.submit`, `tasks.review`, `evaluations.create`, `users.delete` | **Akses Manager**: Assign Tugas Baru, Pindahkan Tugas Non-Aktif, Submit Bukti, Review & Persetujuan, Tempat Sampah (Recycle Bin), Evaluasi KPI Bulanan |

### B. Role Employee (Staf Operasional / Karyawan)

| No | Peran (Role) | Email Login | Password | Nama Pengguna | Jabatan Pegawai | Izin Akses Spesifik | Akses Fitur Utama |
|:--:|:---|:---|:---|:---|:---|:---|:---|
| 1 | 👤 **EMPLOYEE 1** | `sarah@gmail.com` | `password` | Sarah Jenkins | Finance Specialist | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti Dokumen, Filter Tugas Saya, Edit Profil Saya |
| 2 | 👤 **EMPLOYEE 2** | `michael@gmail.com` | `password` | Michael Ross | IT Operations | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti Dokumen, Filter Tugas Saya, Edit Profil Saya |
| 3 | 👤 **EMPLOYEE 3** | `natalie@gmail.com` | `password` | Natalie McDermott | HR Specialist | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti Dokumen, Filter Tugas Saya, Edit Profil Saya |
| 4 | 👤 **EMPLOYEE 4** | `van@gmail.com` | `password` | Van Larkin | Legal Counsel | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti Dokumen, Filter Tugas Saya, Edit Profil Saya |
| 5 | 👤 **EMPLOYEE 5** | `felicity@gmail.com` | `password` | Miss Felicity Runte | Staff Specialist | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti Dokumen, Filter Tugas Saya, Edit Profil Saya |
| 6 | 👤 **EMPLOYEE 6** | `bertrand@gmail.com` | `password` | Bertrand | Operations Staff | `tasks.submit` | Mulai Kerja, Submit Bukti Dokumen, Filter Tugas Saya, Edit Profil Saya |
| 7 | 👤 **EMPLOYEE 7** | `anna@gmail.com` | `password` | Anna Lee | Marketing Officer | `tasks.submit` | Mulai Kerja, Submit Bukti Dokumen, Filter Tugas Saya, Edit Profil Saya |
| 8 | 👤 **EMPLOYEE 8** | `david@gmail.com` | `password` | David Tran | Software Engineer | `tasks.submit` | Mulai Kerja, Submit Bukti Dokumen, Filter Tugas Saya, Edit Profil Saya |

> [!IMPORTANT]
> **Pendaftaran Akun Baru**: Pengguna baru yang didaftarkan melalui menu `/users` secara otomatis memiliki status **`🟢 AKTIF`** dan dapat langsung diloginkan menggunakan password default: **`password`**.

---

## 🗑️ 4. Tempat Sampah Penugasan (Recycle Bin) & Pemulihan (Recovery Engine)

Sistem **Central Saga** menyediakan fitur **Tempat Sampah Penugasan (*Recycle Bin*)** khusus untuk role **Admin & Manager**:

1. 🗑️ **Mekanisme Soft Delete**:
   - Saat Admin atau Manager menghapus tugas di `/tasks`, tugas **TIDAK HILANG PERMANEN**, melainkan dipindahkan ke **Tempat Sampah (Recycle Bin)** (`is_deleted: true`).
   - Aktivitas pencatatan pemindahan tercatat di Log Aktivitas (`TASK_MOVED_TO_TRASH`).

2. 🗃️ **Modal Executive Recycle Bin**:
   - Tombol **`[ 🗑️ Tempat Sampah (${trashedTasks.length}) ]`** tersedia di header kanan atas `/tasks` bagi Admin & Manager.
   - Menampilkan daftar tugas terhapus, penerima tugas, status sebelum dihapus, tanggal dihapus, dan nama yang menghapus.

3. 🔄 **Fitur Pemulihan (Task Recovery)**:
   - Klik **`[ 🔄 Pulihkan ]`**: Tugas otomatis **dikembalikan utuh secara instan (0ms)** ke tabel penugasan aktif!
   - Klik **`[ 🗑️ Hapus Permanen ]`** (Khusus Admin): Menghapus tugas secara permanen dari database sistem.

---

## 🚫 5. Fitur Nonaktifkan User & Pemindahan Tugas (Reassignment Engine)

Sistem **Central Saga** menerapkan **Sistem Non-Aktifkan Akun & Pemindahan Tugas Otomatis**:

1. ⛔ **Penonaktifan Akun (Disabling Account Access)**:
   - Admin dan Manager dapat mengklik tombol **`[ ⛔ Nonaktifkan ]`** pada menu `/users` atau modal Edit Hak Akses.
   - User yang dinonaktifkan ditandai dengan badge khusus **`🔴 NON-AKTIF`**.
   - **Blokir Akses Login**: Akun dengan status `INACTIVE` **TIDAK BISA LOGIN** ke dalam sistem.

2. 🔄 **Pengalihan Otomatis Tugas ke Status `PENDING`**:
   - Saat pengguna dinonaktifkan, seluruh tugas yang dialokasikan kepada pengguna tersebut **secara otomatis diubah statusnya menjadi `PENDING`** dan ditandai membutuhkan pengalihan (*Reassignment Required*).

3. 💼 **Fitur Pemindahan Tugas Khusus Manager & Admin (`/tasks`)**:
   - Pada halaman **Manajemen Tugas (`/tasks`)**, untuk role **Manager dan Admin** disediakan tombol **`[ 🔄 Pindahkan ]`**.
   - Saat diklik, modal **Pindahkan Tugas Karyawan** akan terbuka.
   - Setelah dikonfirmasi, nama karyawan di kolom `EMPLOYEE` **langsung ter-update secara instan**, tugas **muncul di tampilan karyawan baru**, dan **otomatis hilang dari tampilan karyawan lama**!

---

## 🛡️ 6. Matriks Hak Akses Spatie RBAC & Pembatasan Modal Role

| Kunci Permission | Fitur yang Diizinkan | EMPLOYEE | MANAGER | ADMIN |
|:---|:---|:--:|:--:|:--:|
| **`tasks.create`** | Membuat & assign tugas baru (`+ Assign New Task`) | ⚪ *(Dapat Dicentang di Modal)* | 🟢 Ya (Dicentang Bawaan) | 🟢 Ya (Super Admin) |
| **`tasks.submit`** | Unggah berkas / link bukti penyelesaian tugas | 🟢 Ya (Bawaan Utama) | 🟢 Ya (Dicentang Bawaan) | 🟢 Ya (Super Admin) |
| **`tasks.review`** | Meninjau, menyetujui, atau meminta revisi tugas | ⚪ *(Dapat Dicentang di Modal)* | 🟢 Ya (Dicentang Bawaan) | 🟢 Ya (Super Admin) |
| **`evaluations.create`** | Mengisi slider KPI & menerbitkan evaluasi bulanan | ❌ Tidak Tersedia | ⚪ *(Dapat Dicentang di Modal)* | 🟢 Ya (Super Admin) |
| **`evaluations.view_own`** | Melihat kartu skor evaluasi mandiri (*Private Mode*) | 🟢 Ya (Bawaan Utama) | 🟢 Ya (Bawaan Utama) | 🟢 Ya (Super Admin) |
| **`users.manage`** | Buka menu & edit modal Spatie RBAC `/users` | ❌ Tidak Tersedia | ❌ Tidak Tersedia | 🟢 Ya (Super Admin) |
| **`users.delete`** | Mengelola status keaktifan & nonaktifkan user | ❌ Tidak Tersedia | ⚪ *(Dapat Dicentang di Modal)* | 🟢 Ya (Super Admin) |
| **`divisions.manage`** | Mengelola master data divisi & departemen | ❌ Tidak Tersedia | ❌ Tidak Tersedia | 🟢 Ya (Super Admin) |

---

## 📜 7. Sistem Log Aktivitas Real-Time & Pewaktu 5 Detik

1. **Pencatatan Otomatis Aktivitas Seluruh User & Role**:
   - `SPATIE_RBAC_UPDATED`, `USER_DEACTIVATED`, `USER_ACTIVATED`, `TASK_CREATED`, `PROOF_SUBMITTED`, `TASK_REVIEWED`, `TASK_REASSIGNED`, `TASK_MOVED_TO_TRASH`, `TASK_RESTORED`, `USER_LOGIN`, `PASSWORD_RESET`.

2. **Penanda `✨ TERBARU` & Pewaktu Hilang Otomatis 5 Detik**:
   - Seluruh baris log baru yang belum dibaca akan ditandai dengan badge **`✨ TERBARU`** dan sorotan warna latar biru.
   - Begitu halaman **Log Aktivitas** dibuka, penanda `✨ TERBARU` akan **tetap tampil selama 5 detik (5000ms)** kemudian **hilang secara otomatis** dan angka notifikasi di Sidebar kembali 0.

---

## 🔄 8. Panduan Alur Pengujian Fitur Lengkap (SOP Step-by-Step)

1. **Langkah 1 (Nonaktifkan User oleh Admin)**:
   * Login `admin@gmail.com` / `password`.
   * Buka `/users` ➔ Klik **`[ ⛔ Nonaktifkan ]`** pada pengguna (misal: `Michael Ross`).

2. **Langkah 2 (Pengujian Pemindahan & Recovery Tugas)**:
   * Buka `/tasks` ➔ Klik **`[ 🔄 Pindahkan ]`** ➔ Pilih `Van Larkin` ➔ Kolom EMPLOYEE ter-update!
   * Klik tombol **Hapus** pada tugas ➔ Tugas pindah ke **Tempat Sampah**.
   * Buka **`[ 🗑️ Tempat Sampah ]`** ➔ Klik **`[ 🔄 Pulihkan ]`** ➔ Tugas KEMBALI PULIH UTUH!
