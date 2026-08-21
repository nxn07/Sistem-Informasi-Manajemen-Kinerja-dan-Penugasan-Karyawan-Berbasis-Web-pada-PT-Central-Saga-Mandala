# 🔐 DOKUMEN HAK AKSES SPATIE RBAC & KREDENSIAL LOGIN
**Central Saga Enterprise Performance (SIM-KAP)**

> [!NOTE]
> Dokumen ini berisi rincian kredensial login seluruh peranan (*Roles*), izin khusus (*Permissions*), matriks hak akses **Spatie RBAC**, serta panduan alur kerja operasional (*SOP Workflow*) pada sistem **Central Saga**.

---

## 📍 1. URL Akses Sistem

* **Halaman Login**: [http://localhost:3000/login](http://localhost:3000/login)
* **Manajemen Tugas**: [http://localhost:3000/tasks](http://localhost:3000/tasks)
* **Evaluasi Kinerja**: [http://localhost:3000/evaluations](http://localhost:3000/evaluations)
* **Manajemen User & RBAC**: [http://localhost:3000/users](http://localhost:3000/users)
* **Backend API Server**: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)

---

## ⚡ 2. Ringkasan Cepat Email & Password Login (Siap Copy-Paste)

> [!TIP]
> **Password Seluruh Akun**: `password`

| Role / Akses | Nama Pengguna | Email Login | Password | Jabatan / Peran |
|:---|:---|:---|:---|:---|
| 👑 **Super Admin** | Admin System | `admin@gmail.com` | `password` | Super Admin & Pengelola RBAC |
| 👔 **Manager 1** | Manager Utama | `manager@gmail.com` | `password` | Senior General Manager |
| 👔 **Manager 2** | Manager Operasional | `manager2@gmail.com` | `password` | Operations Manager |
| 👤 **Employee 1** | Sarah Jenkins | `sarah@gmail.com` | `password` | Finance Specialist |
| 👤 **Employee 2** | Michael Ross | `michael@gmail.com` | `password` | IT Operations |
| 👤 **Employee 3** | Natalie McDermott | `natalie@gmail.com` | `password` | HR Specialist |
| 👤 **Employee 4** | Van Larkin | `van@gmail.com` | `password` | Legal Counsel |
| 👤 **Employee 5** | Miss Felicity Runte | `felicity@gmail.com` | `password` | Staff Specialist |

---

## 🔑 3. Detail Akses & Fitur Per Role

### A. Role Management (Atasan & Pengelola)

| No | Peran (Role) | Email Login | Password | Nama Pengguna | Izin Akses Spesifik (Permissions Modal RBAC) | Akses Fitur Utama |
|:--:|:---|:---|:---|:---|:---|:---|
| 1 | 👑 **ADMIN** | `admin@gmail.com` | `password` | Admin System | `tasks.create`, `tasks.submit`, `tasks.review`, `users.manage`, `users.delete`, `evaluations.create`, `divisions.manage` (Full `*`) | **Full Super Admin**: Kelola User, Edit RBAC, Master Divisi, KPI Criteria, Audit Log |
| 2 | 👔 **MANAGER 1** | `manager@gmail.com` | `password` | Manager Utama | `tasks.create`, `tasks.submit`, `tasks.review`, `evaluations.create (Opsional)`, `users.delete (Opsional)` | **5 Opsi Manager**: Assign Tugas Baru, Submit Bukti, Review & Persetujuan, Evaluasi KPI, Hapus User |
| 3 | 👔 **MANAGER 2** | `manager2@gmail.com` | `password` | Manager Operasional | `tasks.create`, `tasks.submit`, `tasks.review`, `evaluations.create (Opsional)`, `users.delete (Opsional)` | **5 Opsi Manager**: Assign Tugas Baru, Submit Bukti, Review & Persetujuan, Evaluasi KPI, Hapus User |

### B. Role Employee (Staf Operasional / Karyawan)

| No | Peran (Role) | Email Login | Password | Nama Pengguna | Jabatan Pegawai | Izin Akses Spesifik (Permissions Modal RBAC) | Akses Fitur Utama |
|:--:|:---|:---|:---|:---|:---|:---|:---|
| 1 | 👤 **EMPLOYEE 1** | `sarah@gmail.com` | `password` | Sarah Jenkins | Finance Specialist | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti, Buat Tugas Baru, Filter Tugas Saya |
| 2 | 👤 **EMPLOYEE 2** | `michael@gmail.com` | `password` | Michael Ross | IT Operations | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti, Filter Tugas Saya |
| 3 | 👤 **EMPLOYEE 3** | `natalie@gmail.com` | `password` | Natalie McDermott | HR Specialist | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti, Filter Tugas Saya |
| 4 | 👤 **EMPLOYEE 4** | `van@gmail.com` | `password` | Van Larkin | Legal Counsel | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti, Filter Tugas Saya |
| 5 | 👤 **EMPLOYEE 5** | `felicity@gmail.com` | `password` | Miss Felicity Runte | Staff Specialist | `tasks.create`, `tasks.submit`, `tasks.review` | Mulai Kerja, Submit Bukti, Filter Tugas Saya |

> [!IMPORTANT]
> **Akun Baru**: Pengguna baru yang didaftarkan melalui menu `/users` dapat langsung diloginkan menggunakan email baru tersebut dan password default: **`password`**.

---

## 🛡️ 4. Matriks Hak Akses Spatie RBAC

Tabel di bawah ini menjelaskan hak akses bawaan dan izin khusus (*Custom Permission*) yang dapat diatur via modal Edit Hak Akses di menu `/users`:

| Kunci Permission | Fitur yang Diizinkan | EMPLOYEE | MANAGER | ADMIN |
|:---|:---|:--:|:--:|:--:|
| **`tasks.create`** | Membuat & assign tugas baru (`+ Assign New Task`) | ⚪ *(Dapat Dicentang di Modal)* | 🟢 Ya (Dicentang Bawaan) | 🟢 Ya (Super Admin) |
| **`tasks.submit`** | Unggah berkas / link bukti penyelesaian tugas | 🟢 Ya (Bawaan Utama) | 🟢 Ya (Dicentang Bawaan) | 🟢 Ya (Super Admin) |
| **`tasks.review`** | Meninjau, menyetujui, atau meminta revisi tugas | ⚪ *(Dapat Dicentang di Modal)* | 🟢 Ya (Dicentang Bawaan) | 🟢 Ya (Super Admin) |
| **`evaluations.create`** | Mengisi slider KPI & menerbitkan evaluasi bulanan | ❌ Tidak Tersedia *(Dihapus)* | ⚪ *(Dapat Dicentang di Modal)* | 🟢 Ya (Super Admin) |
| **`evaluations.view_own`** | Melihat kartu skor evaluasi mandiri (*Private Mode*) | 🟢 Ya (Bawaan Utama) | 🟢 Ya (Bawaan Utama) | 🟢 Ya (Super Admin) |
| **`users.manage`** | Buka menu & edit modal Spatie RBAC `/users` | ❌ Tidak Tersedia *(Dihapus)* | ❌ Tidak Tersedia *(Dihapus)* | 🟢 Ya (Super Admin) |
| **`users.delete`** | Menghapus data akun karyawan / pengguna dari sistem | ❌ Tidak Tersedia *(Dihapus)* | ⚪ *(Dapat Dicentang di Modal)* | 🟢 Ya (Super Admin) |
| **`divisions.manage`** | Mengelola master data divisi & departemen | ❌ Tidak Tersedia *(Dihapus)* | ❌ Tidak Tersedia *(Dihapus)* | 🟢 Ya (Super Admin) |
| **`kpis.manage`** | Mengatur kriteria & bobot persentase KPI (100%) | ❌ Tidak Tersedia *(Dihapus)* | ❌ Tidak Tersedia *(Dihapus)* | 🟢 Ya (Super Admin) |
| **`logs.view`** | Melihat riwayat audit log aktivitas sistem | ❌ Tidak Tersedia *(Dihapus)* | ❌ Tidak Tersedia *(Dihapus)* | 🟢 Ya (Super Admin) |

---

## 🔑 5. Penjelasan Lengkap Checkbox "Izin Akses Spesifik (Permissions)" (Lihat Modal Edit RBAC)

Sistem **Central Saga** menerapkan pembagian opsi centang izin akses yang disesuaikan secara presisi berdasarkan **Role Utama** pada modal Edit Hak Akses:

### A. Opsi Checkbox Khusus Role EMPLOYEE (Staf Operasional - 3 Opsi)
Bagi akun ber-role **EMPLOYEE**, opsi hak akses khusus manajemen (`users.manage`, `users.delete`, `evaluations.create`, `divisions.manage`) **DIHAPUS DARI CHECKLIST MODAL** untuk menjaga kejelasan peran:
1. 📝 **`tasks.create (Buat Tugas)`**: Memberikan hak bagi pegawai untuk membuat & assign tugas baru (`+ Assign New Task`).
2. 📤 **`tasks.submit (Submit Bukti)`**: Memberikan hak mengumpulkan dokumen / link bukti pekerjaan (`[ Kumpulkan Bukti ]`).
3. 🔍 **`tasks.review (Review Atasan)`**: Memberikan hak peninjau (*Reviewer*) untuk menyetujui / meminta revisi tugas (`[ 👁️ Review & Berkas ]`).

### B. Opsi Checkbox Khusus Role MANAGER (Atasan Operasional - 5 Opsi)
Bagi akun ber-role **MANAGER**, modal menampilkan 5 opsi khusus:
1. 📝 **`tasks.create (Buat Tugas)`**: Aktif secara bawaan.
2. 📤 **`tasks.submit (Submit Bukti)`**: Aktif secara bawaan.
3. 🔍 **`tasks.review (Review Atasan)`**: Aktif secara bawaan.
4. 📊 **`evaluations.create (Evaluasi)`**: Dapat dicentang oleh Admin untuk memberikan hak pembuatan evaluasi KPI.
5. 🗑️ **`users.delete (Hapus Karyawan)`**: Dapat dicentang oleh Admin untuk mengaktifkan tombol tempat sampah (`Trash2`) & menu `/users`.

### C. Opsi Checkbox Khusus Role ADMIN & Proteksi Keamanan (Admin Locked)
1. Bagi akun ber-role **ADMIN**, seluruh 7 opsi checklist manajemen tersedia lengkap (`tasks.create`, `tasks.submit`, `tasks.review`, `users.manage`, `users.delete`, `evaluations.create`, `divisions.manage`).
2. 🔒 **Proteksi Keamanan Role Admin**: Pada tabel `/users`, akun Super Admin (`Admin System`) secara otomatis diproteksi dengan badge **`🔒 Admin Terkunci`**. Tombol Edit Hak Akses & Hapus User disembunyikan untuk mencegah perubahan hak akses Super Admin secara tidak sengaja.
3. Pada modal Edit Hak Akses, pilihan role pill disajikan untuk `MANAGER` dan `EMPLOYEE` guna menjaga integritas struktur RBAC.

---

## 📋 6. Matriks Status Tugas & SOP Pengumpulan

Alur resmi siklus pengerjaan tugas di Central Saga:

| Status | Makna Status | Pengubah Status | Aksi Tampilan Karyawan | Aksi Tampilan Atasan |
|:---|:---|:---|:---|:---|
| **`PENDING`** | Tugas baru dibuat, belum mulai dikerjakan | Manager / Admin | `[ Mulai Kerja ]` | `[ Quick Status Selector ]` |
| **`IN_PROGRESS`** | Tugas sedang aktif dikerjakan oleh pegawai | Employee / Manager | `[ Kumpulkan Bukti ]` | `[ Review & Berkas ]` |
| **`SUBMITTED`** | Bukti kerja (file/link Drive) telah diunggah | Employee | `[ 👁️ Detail ]` | `[ 👁️ Review & Berkas ]` |
| **`APPROVED`** | Bukti kerja disetujui oleh Atasan | Manager / Admin | `[ 👁️ Detail ]` | `[ Approved ✓ ]` |
| **`REVISION`** | Bukti kerja perlu diperbaiki kembali | Manager / Admin | `[ 🔄 Perbaiki & Ajukan ]` | `[ 👁️ Review & Berkas ]` |
| **`REJECTED`** | Pekerjaan ditolak oleh Atasan | Manager / Admin | `[ 🔄 Perbaiki & Ajukan ]` | `[ Quick Status Selector ]` |

---

## 🚀 7. Fitur Unggulan Sistem

1. **Detail & Live Document Viewer Modal (`TaskDetailModal`)**:
   * Menampilkan rincian tugas, bobot skor (1–10), nama pegawai & NIP, timestamp upload (`20 Ags 2026, 09:54 WIB`), jenis dokumen (PDF, Word, Excel, ZIP, Link Drive), serta tombol **`[ 🔗 Buka & Lihat Berkas Dokumen Langsung ]`**.

2. **Filter Tampilan Karyawan (`Tugas Saya` vs `Tugas Tim`)**:
   * Karyawan dapat beralih antara **`[ 👤 Tugas Saya Saja ]`** dan **`[ 👥 Semua Tugas Tim ]`**.
   * Tugas rekan tim lain diproteksi secara otomatis dengan badge **`🔒 Tugas Rekan Tim`**.

3. **Manajemen Hapus Karyawan & Delegasi RBAC (`users.delete`)**:
   * Admin memiliki wewenang penuh untuk menghapus data akun karyawan secara real-time via tombol sampah (`Trash2`).
   * Admin juga dapat mendelegasikan izin `users.delete` kepada Manager tertentu melalui modal **Edit Hak Akses Spatie RBAC**.

4. **Desain Eksekutif Mewah & Garis Tabel Tegas (`Executive UI System`)**:
   * Seluruh tabel dilapisi **Header Gradasi Navy (`from-slate-900 via-blue-950 to-slate-900 text-white`)**, kolom **`NO.`** (`01`, `02`, `03`), garis pembatas sel tegas 1px (`border-r border-slate-300` & `divide-y divide-slate-300`), bar pencarian melayang tunggal (*Sleek Floating Toolbar*), serta animasi saklar **Sliding Pill 300ms**.

---

## 🔄 8. Panduan Alur Pengujian (Step-by-Step)

1. **Langkah 1 (Admin)**:
   * Login `admin@gmail.com` / `password`.
   * Buka `/users` ➔ Klik **Edit Hak Akses** pada Sarah Jenkins ➔ Centang **`tasks.create`** ➔ Klik **Simpan Hak Akses**.

2. **Langkah 2 (Employee dengan Custom Permission)**:
   * Logout, lalu login `sarah@gmail.com` / `password`.
   * Buka `/tasks` ➔ Tombol **`+ Assign New Task`** di kanan atas aktif dan bisa digunakan!
   * Klik **`[ 👤 Tugas Saya Saja ]`** ➔ Klik judul tugas untuk membuka modal detail dokumen.

3. **Langkah 3 (Resubmission Status Rejected / Revision)**:
   * Pada tugas berstatus `REJECTED` atau `REVISION`, klik **`[ 🔄 Perbaiki & Ajukan Ulang ]`**.
   * Unggah file/link baru ➔ Status otomatis diperbarui menjadi **`SUBMITTED`**.
