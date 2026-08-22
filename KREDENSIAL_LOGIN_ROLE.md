# 🔐 DOKUMEN HAK AKSES SPATIE RBAC & KREDENSIAL LOGIN
**Central Saga Enterprise Performance (SIM-KAP)**

> [!NOTE]
> Dokumen ini berisi rincian kredensial login seluruh peranan (*Roles*), status keaktifan akun, izin khusus (*Permissions*), matriks hak akses **Spatie RBAC**, fitur pemindahan tugas pegawai non-aktif, serta panduan alur kerja operasional (*SOP Workflow*) pada sistem **Central Saga**.

---

## 📍 1. URL Akses Sistem

* **Halaman Login**: [http://localhost:3000/login](http://localhost:3000/login)
* **Reset Password**: [http://localhost:3000/reset-password](http://localhost:3000/reset-password)
* **Dashboard Overview**: [http://localhost:3000](http://localhost:3000)
* **Manajemen Tugas**: [http://localhost:3000/tasks](http://localhost:3000/tasks)
* **Evaluasi Kinerja**: [http://localhost:3000/evaluations](http://localhost:3000/evaluations)
* **Manajemen User & RBAC**: [http://localhost:3000/users](http://localhost:3000/users)
* **Backend API Server**: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)

---

## ⚡ 2. Ringkasan Cepat Email & Password Login (Siap Copy-Paste)

> [!TIP]
> **Password Bawaan Seluruh Akun**: `password`  
> *(Catatan: Password dapat diubah secara mandiri melalui menu [Reset Password](http://localhost:3000/reset-password) dengan konfirmasi OTP ke email testing default `putra.timur804@gmail.com`)*

| Role / Akses | Nama Pengguna | Email Login | Password Bawaan | Status Akun | Jabatan / Peran |
|:---|:---|:---|:---|:---:|:---|
| 👑 **Super Admin** | Admin System | `admin@gmail.com` | `password` | 🟢 AKTIF | Super Admin & Pengelola RBAC |
| 👔 **Manager 1** | Manager Utama | `manager@gmail.com` | `password` | 🟢 AKTIF | Senior General Manager |
| 👔 **Manager 2** | Manager Operasional | `manager2@gmail.com` | `password` | 🟢 AKTIF | Operations Manager |
| 👤 **Employee 1** | Sarah Jenkins | `sarah@gmail.com` | `password` | 🟢 AKTIF | Finance Specialist |
| 👤 **Employee 2** | Michael Ross | `michael@gmail.com` | `password` | 🟢 AKTIF | IT Operations |
| 👤 **Employee 3** | Natalie McDermott | `natalie@gmail.com` | `password` | 🟢 AKTIF | HR Specialist |
| 👤 **Employee 4** | Van Larkin | `van@gmail.com` | `password` | 🟢 AKTIF | Legal Counsel |
| 👤 **Employee 5** | Miss Felicity Runte | `felicity@gmail.com` | `password` | 🟢 AKTIF | Staff Specialist |

---

## 🔑 3. Detail Akses & Fitur Per Role

### A. Role Management (Atasan & Pengelola)

| No | Peran (Role) | Email Login | Password | Nama Pengguna | Izin Akses Spesifik (Permissions Modal RBAC) | Akses Fitur Utama |
|:--:|:---|:---|:---|:---|:---|:---|
| 1 | 👑 **ADMIN** | `admin@gmail.com` | `password` | Admin System | `tasks.create`, `tasks.submit`, `tasks.review`, `users.manage`, `users.delete`, `evaluations.create`, `divisions.manage` (Full `*`) | **Full Super Admin**: Kelola User, Status Keaktifan, Edit RBAC, Pindahkan Tugas, Master Divisi, KPI Criteria, Audit Log |
| 2 | 👔 **MANAGER 1** | `manager@gmail.com` | `password` | Manager Utama | `tasks.create`, `tasks.submit`, `tasks.review`, `evaluations.create`, `users.delete` | **Akses Manager**: Assign Tugas Baru, Pindahkan Tugas Non-Aktif, Submit Bukti, Review & Persetujuan, Evaluasi KPI, Kelola Status User |
| 3 | 👔 **MANAGER 2** | `manager2@gmail.com` | `password` | Manager Operasional | `tasks.create`, `tasks.submit`, `tasks.review`, `evaluations.create`, `users.delete` | **Akses Manager**: Assign Tugas Baru, Pindahkan Tugas Non-Aktif, Submit Bukti, Review & Persetujuan, Evaluasi KPI, Kelola Status User |

### B. Role Employee (Staf Operasional / Karyawan)

| No | Peran (Role) | Email Login | Password | Nama Pengguna | Jabatan Pegawai | Izin Akses Spesifik (Permissions Modal RBAC) | Akses Fitur Utama |
|:--:|:---|:---|:---|:---|:---|:---|:---|
| 1 | 👤 **EMPLOYEE 1** | `sarah@gmail.com` | `password` | Sarah Jenkins | Finance Specialist | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti, Buat Tugas Baru, Filter Tugas Saya |
| 2 | 👤 **EMPLOYEE 2** | `michael@gmail.com` | `password` | Michael Ross | IT Operations | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti, Filter Tugas Saya |
| 3 | 👤 **EMPLOYEE 3** | `natalie@gmail.com` | `password` | Natalie McDermott | HR Specialist | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti, Filter Tugas Saya |
| 4 | 👤 **EMPLOYEE 4** | `van@gmail.com` | `password` | Van Larkin | Legal Counsel | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti, Filter Tugas Saya |
| 5 | 👤 **EMPLOYEE 5** | `felicity@gmail.com` | `password` | Miss Felicity Runte | Staff Specialist | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti, Filter Tugas Saya |

> [!IMPORTANT]
> **Akun Baru & Status**: Pengguna baru yang didaftarkan melalui menu `/users` secara otomatis memiliki status **`🟢 AKTIF`** dan dapat langsung diloginkan menggunakan password default: **`password`**.

---

## 🚫 4. Fitur Nonaktifkan User & Pemindahan Tugas (Reassignment Engine)

Sistem **Central Saga** menerapkan mekanisme pengganti penghapusan permanen dengan **Sistem Non-Aktifkan Akun & Pemindahan Tugas Otomatis**:

1. ⛔ **Penonaktifan Akun (Disabling Account Access)**:
   - Admin dan Manager dapat mengklik tombol **`[ ⛔ Nonaktifkan ]`** pada menu `/users` atau melalui panel **Status Keaktifan Akun** di dalam modal Edit Hak Akses.
   - User yang dinonaktifkan ditandai dengan badge khusus **`🔴 NON-AKTIF`**.
   - **Blokir Akses Login**: Akun dengan status `INACTIVE` **TIDAK BISA LOGIN** ke dalam sistem. Percobaan login akan ditolak secara otomatis oleh sistem.

2. 🔄 **Pengalihan Otomatis Tugas ke Status `PENDING`**:
   - Saat pengguna dinonaktifkan, seluruh tugas yang dialokasikan kepada pengguna tersebut **secara otomatis diubah statusnya menjadi `PENDING`** dan ditandai membutuhkan pengalihan (*Reassignment Required*).

3. 💼 **Fitur Pemindahan Tugas Khusus Manager & Admin (`/tasks`)**:
   - Pada halaman **Manajemen Tugas (`/tasks`)**, untuk role **Manager dan Admin** disediakan tombol **`[ 🔄 Pindahkan ]`**.
   - Saat diklik, modal **Pindahkan Tugas Karyawan** akan terbuka, menampilkan pemilik tugas saat ini dan menyediakan dropdown pilihan **Karyawan Aktif Baru**.
   - Setelah dikonfirmasi, tugas secara resmi dipindahkan ke karyawan aktif terpilih dan statusnya diperbarui menjadi **`IN_PROGRESS`**.

---

## 🛡️ 5. Matriks Hak Akses Spatie RBAC & Pembatasan Modal Role

Tabel di bawah ini menjelaskan hak akses bawaan dan izin khusus (*Custom Permission*) yang diatur secara presisi dalam modal Edit Hak Akses di menu `/users`:

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

### 🔒 Pembatasan Tampilan Modal Edit Hak Akses Sesuai Role (Role-Locked Indicator)
- **Role EMPLOYEE (`👤 EMPLOYEE`)**: Hanya menampilkan opsi/badge **`👤 EMPLOYEE` (Terbatas khusus role EMPLOYEE)** dan daftar izin khusus Employee (`tasks.create`, `tasks.submit`, `tasks.review`). Opsi memilih role Admin / Manager disembunyikan total.
- **Role MANAGER (`💼 MANAGER`)**: Hanya menampilkan opsi/badge **`💼 MANAGER`** dan daftar izin khusus Manager (`tasks.create`, `tasks.submit`, `tasks.review`, `evaluations.create`, `users.delete`).
- **Role ADMIN (`👑 ADMIN`)**: Hanya menampilkan opsi/badge **`👑 ADMIN`** dan daftar izin penuh Admin.

---

## 🎨 6. Tampilan Layout & Footer Fixed Edge-to-Edge

1. 📌 **Footer Floating Fixed Bottom (`fixed bottom-0 left-0 md:left-64 right-0 z-40 bg-white/95`)**:
   - Footer terkunci secara permanen di permukaan paling bawah layar monitor (tepat di atas Taskbar Windows).
   - Menempel presisi rapat ke Sidebar di sebelah kiri (`md:left-64`) tanpa gap dan memanjang penuh hingga ke batas kanan layar.
   - Tidak terpengaruh oleh scrolling pada SELURUH HALAMAN (Dashboard, Tasks, Evaluations, Divisions, KPIs, Users, Activity Logs, Settings).

2. 🌿 **Brand Identity**:
   - Menyajikan logo **Green Central Saga**, label **`v2.0 Official`**, hak cipta **`© 2026 Central Saga Inc. SIM-KAP`**, serta indikator **`🟢 Server PostgreSQL 16.2 Active`**.

---

## 🔄 7. Panduan Alur Pengujian Fitur Lengkap (SOP Step-by-Step)

1. **Langkah 1 (Nonaktifkan User oleh Admin)**:
   * Login `admin@gmail.com` / `password`.
   * Buka `/users` ➔ Klik **`[ ⛔ Nonaktifkan ]`** pada pengguna (misal: `Michael Ross`).
   * Perhatikan status akun berubah menjadi **`🔴 NON-AKTIF`**.

2. **Langkah 2 (Pengujian Blokir Login)**:
   * Logout dari sistem.
   * Coba login dengan `michael@gmail.com` / `password` ➔ Akses login ditolak dengan notifikasi *"Akun Anda telah dinonaktifkan oleh Administrator"*.

3. **Langkah 3 (Pemindahan Tugas oleh Manager / Admin)**:
   * Login kembali sebagai `manager@gmail.com` / `password` atau `admin@gmail.com` / `password`.
   * Buka menu `/tasks` ➔ Cari tugas yang sebelumnya dimiliki `Michael Ross` (status otomatis `PENDING`).
   * Klik **`[ 🔄 Pindahkan ]`** ➔ Pilih Karyawan Aktif baru (misal: `Sarah Jenkins`) ➔ Klik **Konfirmasi Pindahkan Tugas**.
   * Tugas berhasil dialihkan ke `Sarah Jenkins` dengan status `IN_PROGRESS`!

4. **Langkah 4 (Reset Password Mandiri)**:
   * Buka halaman `/reset-password`.
   * Masukkan email `sarah@gmail.com` ➔ Masukkan OTP konfirmasi yang dikirimkan ke email testing `putra.timur804@gmail.com` ➔ Set password baru.
   * Login dengan password baru berhasil!

---

## 📜 8. Sistem Log Aktivitas Real-Time & Lencana Unread Notifikasi Sidebar (`Log Aktivitas Counter`)

Sistem **Central Saga** mencatat seluruh jejak aktivitas pengguna (*Audit Trail*) secara otomatis dan real-time:

1. **Pencatatan Otomatis Aktivitas Seluruh User & Role**:
   - **Perubahan RBAC / Role**: `SPATIE_RBAC_UPDATED` (Perubahan izin atau status role user oleh Admin).
   - **Status User**: `USER_DEACTIVATED` / `USER_ACTIVATED` (Penonaktifan atau pengaktifan akun karyawan).
   - **Manajemen Tugas**: `TASK_CREATED` (Pembuatan tugas baru), `PROOF_SUBMITTED` (Pengunggahan bukti penyelesaian tugas), `TASK_REVIEWED` (Review persetujuan / revisi atasan), `TASK_REASSIGNED` (Pemindahan tugas pegawai non-aktif).
   - **Aktivitas Akun**: `USER_LOGIN` (Masuk sistem) & `PASSWORD_RESET` (Reset password).

2. **Lencana Unread Notifikasi Real-Time di Sidebar (`Sidebar Badge Counter`)**:
   - Pada item menu **Log Aktivitas** di Sidebar navigasi sebelah kiri, tampil lencana angka notifikasi unread.
   - Angka lencana ini **menunjukkan jumlah log baru yang belum dibaca**.
   - Saat menu **Log Aktivitas** diklik/dibuka, angka di Sidebar hilang (menjadi 0) dan penanda `✨ TERBARU` di tabel hilang otomatis setelah 5 detik!

