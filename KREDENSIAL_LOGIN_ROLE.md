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

## 🔑 2. Daftar Kredensial Login Pengguna

> [!TIP]
> **Password Universal**: Kata sandi untuk **seluruh akun** di bawah ini adalah **`password`**.

### A. Role Management (Atasan & Pengelola)

| No | Peran (Role) | Email Login | Password | Nama Pengguna | Akses Menu & Fungsi |
|:--:|:---|:---|:---|:---|:---|
| 1 | 👑 **ADMIN** | `admin@gmail.com` | `password` | Admin System | **8 Menu Complete**: Full Super Admin, Kelola User, RBAC, Divisi, KPI, Audit Log |
| 2 | 👔 **MANAGER** | `manager@gmail.com` | `password` | Manager Utama | **3 Menu Operasional**: Assign Tugas Baru, Review & Disetujui/Revisi, Evaluasi KPI |

### B. Role Employee (Staf Operasional)

| No | Peran (Role) | Email Login | Password | Nama Pengguna | Jabatan Pegawai | Akses Fitur Utama |
|:--:|:---|:---|:---|:---|:---|:---|
| 1 | 👤 **EMPLOYEE 1** | `sarah@gmail.com` | `password` | Sarah Jenkins | Finance Specialist | Mulai Kerja, Submit Bukti, Custom Create Task |
| 2 | 👤 **EMPLOYEE 2** | `michael@gmail.com` | `password` | Michael Ross | IT Operations | Filter Tugas Saya, Submit & Perbaiki Bukti |
| 3 | 👤 **EMPLOYEE 3** | `natalie@gmail.com` | `password` | Natalie McDermott | UI/UX Designer | Filter Tugas Saya, Submit & Perbaiki Bukti |
| 4 | 👤 **EMPLOYEE 4** | `van@gmail.com` | `password` | Van Larkin | Quality Assurance | Filter Tugas Saya, Submit & Perbaiki Bukti |

> [!IMPORTANT]
> **Akun Baru**: Pengguna baru yang didaftarkan melalui menu `/users` dapat langsung diloginkan menggunakan email baru tersebut dan password default: **`password`**.

---

## 🛡️ 3. Matriks Hak Akses Spatie RBAC

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

## 📋 4. Matriks Status Tugas & SOP Pengumpulan

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

## 🚀 5. Fitur Unggulan Sistem

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

## 🔄 6. Panduan Alur Pengujian (Step-by-Step)

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
