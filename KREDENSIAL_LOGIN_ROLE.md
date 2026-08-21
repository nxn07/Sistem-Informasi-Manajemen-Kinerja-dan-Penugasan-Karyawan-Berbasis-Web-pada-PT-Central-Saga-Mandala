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

| No | Peran (Role) | Email Login | Password | Nama Pengguna | Akses Menu & Fungsi |
|:--:|:---|:---|:---|:---|:---|
| 1 | 👑 **ADMIN** | `admin@gmail.com` | `password` | Admin System | **8 Menu Complete**: Full Super Admin, Kelola User, RBAC, Divisi, KPI, Audit Log |
| 2 | 👔 **MANAGER 1** | `manager@gmail.com` | `password` | Manager Utama | **3 Menu Operasional**: Assign Tugas Baru, Review & Disetujui/Revisi, Evaluasi KPI |
| 3 | 👔 **MANAGER 2** | `manager2@gmail.com` | `password` | Manager Operasional | **3 Menu Operasional**: Assign Tugas Baru, Review & Disetujui/Revisi, Evaluasi KPI |

### B. Role Employee (Staf Operasional / Karyawan)

| No | Peran (Role) | Email Login | Password | Nama Pengguna | Jabatan Pegawai | Akses Fitur Utama |
|:--:|:---|:---|:---|:---|:---|:---|
| 1 | 👤 **EMPLOYEE 1** | `sarah@gmail.com` | `password` | Sarah Jenkins | Finance Specialist | Mulai Kerja, Submit Bukti, Buat Tugas Baru, Filter Tugas Saya |
| 2 | 👤 **EMPLOYEE 2** | `michael@gmail.com` | `password` | Michael Ross | IT Operations | Mulai Kerja, Submit Bukti, Filter Tugas Saya |
| 3 | 👤 **EMPLOYEE 3** | `natalie@gmail.com` | `password` | Natalie McDermott | HR Specialist | Mulai Kerja, Submit Bukti, Filter Tugas Saya |
| 4 | 👤 **EMPLOYEE 4** | `van@gmail.com` | `password` | Van Larkin | Legal Counsel | Mulai Kerja, Submit Bukti, Filter Tugas Saya |
| 5 | 👤 **EMPLOYEE 5** | `felicity@gmail.com` | `password` | Miss Felicity Runte | Staff Specialist | Mulai Kerja, Submit Bukti, Filter Tugas Saya |

> [!IMPORTANT]
> **Akun Baru**: Pengguna baru yang didaftarkan melalui menu `/users` dapat langsung diloginkan menggunakan email baru tersebut dan password default: **`password`**.

---

## 🛡️ 4. Matriks Hak Akses Spatie RBAC

Tabel di bawah ini menjelaskan hak akses bawaan dan izin khusus (*Custom Permission*) yang dapat diatur via menu `/users`:

| Kunci Permission | Fitur yang Diizinkan | EMPLOYEE | MANAGER | ADMIN |
|:---|:---|:--:|:--:|:--:|
| **`tasks.create`** | Membuat & assign tugas baru (`+ Assign New Task`) | ⚪ *(Izin Khusus)* | 🟢 Ya | 🟢 Ya |
| **`tasks.submit`** | Unggah berkas / link bukti penyelesaian tugas | 🟢 Ya | 🟢 Ya | 🟢 Ya |
| **`tasks.review`** | Meninjau, menyetujui, atau meminta revisi tugas | ⚪ *(Izin Khusus)* | 🟢 Ya | 🟢 Ya |
| **`evaluations.create`** | Mengisi slider KPI & menerbitkan evaluasi bulanan | ❌ Tidak | 🟢 Ya | 🟢 Ya |
| **`evaluations.view_own`** | Melihat kartu skor evaluasi mandiri (*Private Mode*) | 🟢 Ya | 🟢 Ya | 🟢 Ya |
| **`users.manage`** | Buka menu & edit modal Spatie RBAC `/users` | ❌ Tidak | ❌ Tidak | 🟢 Ya |
| **`users.delete`** | Menghapus data akun karyawan / pengguna dari sistem | ❌ Tidak | ⚪ *(Izin Khusus)* | 🟢 Ya |
| **`divisions.manage`** | Mengelola master data divisi & departemen | ❌ Tidak | ❌ Tidak | 🟢 Ya |
| **`kpis.manage`** | Mengatur kriteria & bobot persentase KPI (100%) | ❌ Tidak | ❌ Tidak | 🟢 Ya |
| **`logs.view`** | Melihat riwayat audit log aktivitas sistem | ❌ Tidak | ❌ Tidak | 🟢 Ya |

---

## 🔑 5. Penjelasan Lengkap Checkbox "Izin Akses Spesifik (Permissions)" (Lihat Modal Edit RBAC)

Sistem **Central Saga** menerapkan pembagian opsi centang izin akses yang disesuaikan secara presisi berdasarkan **Role Utama** di modal Edit Hak Akses:

### A. Opsi Checkbox Khusus Role EMPLOYEE (Staf Operasional)
Bagi akun ber-role **EMPLOYEE**, opsi hak akses khusus manajemen (`users.manage`, `users.delete`, `evaluations.create`, `divisions.manage`) **SECARA OTOMATIS DIHAPUS DARI TAMPILAN CHECKLIST MODAL** untuk mencegah tumpang tindih kewenangan:
1. 📝 **`tasks.create (Buat Tugas)`**: Memberikan hak bagi pegawai untuk membuat & mendelegasikan tugas baru (`+ Assign New Task`).
2. 📤 **`tasks.submit (Submit Bukti)`**: Memberikan hak mengumpulkan dokumen / link bukti pekerjaan (`[ Kumpulkan Bukti ]`).
3. 🔍 **`tasks.review (Review Atasan)`**: Memberikan hak peninjau (*Reviewer*) untuk menyetujui / meminta revisi tugas (`[ 👁️ Review & Berkas ]`).

### B. Opsi Checkbox Khusus Role MANAGER & ADMIN
Bagi akun ber-role **MANAGER** dan **ADMIN**, opsi tambahan manajemen tingkat tinggi seperti `users.manage` (Kelola User), `users.delete` (Hapus Karyawan), `evaluations.create` (Evaluasi KPI), dan `divisions.manage` (Master Divisi) tersedia lengkap untuk dikelola oleh Super Admin.

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
