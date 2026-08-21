# 🚀 SIM-KAP — Frontend Interactive Master Plan
> **Sistem Informasi Kinerja Pegawai**  
> *Stack:* Next.js (App Router) • TypeScript • Tailwind CSS • Axios • Laravel REST API

---

### 📊 Live Progress Tracker

```text
Progress : [████████████████████] 100%
Status   : 🎉 ALL 5 PHASES COMPLETED ➔ 100% PRODUCTION READY
🧭 5-PHASE EXECUTION ROADMAP
🔷 FASE 1 — FOUNDATION (Dasar & Setup)
Membangun pondasi environment, struktur file modular, dan utility system.

[x] 01. Inisialisasi Project Next.js

Setup Next.js 16 + TypeScript + Tailwind CSS via Turbopack.

[x] 02. Struktur Direktori Modular

Folder terisolasi: app/, lib/, types/, services/, hooks/, components/.

[x] 03. Environment Configuration

Konfigurasi .env.local (NEXT_PUBLIC_API_BASE_URL & NEXT_PUBLIC_STORAGE_BASE_URL).

[x] 04. Styles & Utility System

Setup globals.css dan fungsi helper lib/utils.ts (cn, formatDate).

🔷 FASE 2 — CORE ARCHITECTURE (Infrastruktur Data & Auth)
Standardisasi komunikasi HTTP, kontrak tipe data, dan sistem proteksi rute.

[x] 05. TypeScript Types Mirroring Backend

Pemetaan DTO & database model di types/api.ts (User, Task, Division, Evaluation, KPI).

[x] 06. Axios HTTP Client & Interceptors

File lib/api-client.ts lengkap dengan Bearer Token Request Header dan 401 Auto-Redirect.

[x] 07. Auth Service Layer

Implementasi login, getMe, session cookie storage, dan logout di services/auth-service.ts.

[x] 08. Proxy & Route Guard

Penjaga rute terotentikasi vs publik via middleware.ts.

🔷 FASE 3 — UI DEVELOPMENT (Layout & Komponen Dasar)
Penyusunan kerangka antarmuka dashboard dan autentikasi.

[x] 09. Root & Dashboard Layout

Wrapper responsif di app/(dashboard)/layout.tsx.

[x] 10. Shared Navigation Components

Navigasi modular di components/shared/Sidebar.tsx dan components/shared/Navbar.tsx.

[x] 11. Server & Client Pages (Login Module)

Halaman login dengan state handling dan error feedback di app/(auth)/login/page.tsx.

[x] 12. Client Dashboard Shell

Tampilan awal dashboard tugas di app/(dashboard)/tasks/page.tsx.

🔷 FASE 4 — FEATURE INTEGRATION (Modul & Fungsionalitas Bisnis)
Menghubungkan seluruh fitur transaksi SIM-KAP ke backend Laravel.

[x] 13. Forms & Data Validation

[x] Schema form validation menggunakan Zod & React Hook Form (Create Task).

[x] Form pengumpulan bukti kerja (Task Submission).

[x] 14. Feature Services Implementation

[x] Task Service: services/task-service.ts

[x] User & Employee Service: services/user-service.ts

[x] 15. Custom React Hooks & State Management

[x] Hook useAuth (User data, role verification, session guard).

[x] Hook useTasks (CRUD state & revalidation).

[x] 16. Role-Based Access Control (RBAC) UI

[x] Proteksi tampilan elemen tombol & menu berdasarkan roles / permissions.

🔷 FASE 5 — QUALITY & RELEASE (Media, UX & Deployment)
Penyempurnaan pengalaman pengguna, upload berkas, dan build produksi.

[x] 17. Media & Evidence Upload

[x] Integrasi upload berkas PDF/Image bukti tugas via multipart/form-data.

[x] 18. UX States, Skeleton & Boundaries

[x] Fallback animasi loading TaskCardSkeleton & loading.tsx.

[x] Error boundary error.tsx & visual 404 not-found.tsx.

[x] 19. Production Build & Linting

[x] Verifikasi tipe TypeScript dan compiler build (npm run build).

[x] 20. Deployment & Containerization

[x] Konfigurasi container multi-stage build Podman/Docker.

📁 MASTER DIRECTORY MAP
Plaintext
frontend/
├── ⚙️ .env.local
├── 🛡️ middleware.ts
├── ⚡ next.config.ts
├── 📦 package.json
├── 📘 SIMKAP_FRONTEND_ROADMAP.md
├── 📂 app/
│   ├── 📂 (auth)/
│   │   └── 📂 login/ ➔ page.tsx
│   ├── 📂 (dashboard)/
│   │   ├── 📄 layout.tsx
│   │   ├── 📂 tasks/ ➔ page.tsx
│   │   ├── 📂 divisions/
│   │   ├── 📂 kpis/
│   │   ├── 📂 evaluations/
│   │   └── 📂 users/
│   ├── 📄 globals.css
│   └── 📄 layout.tsx
├── 📂 components/
│   ├── 📂 shared/ (Navbar.tsx, Sidebar.tsx)
│   └── 📂 ui/
├── 📂 hooks/
├── 📂 lib/ (api-client.ts, utils.ts)
├── 📂 services/ (auth-service.ts, task-service.ts)
└── 📂 types/ (api.ts)
