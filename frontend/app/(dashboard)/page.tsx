"use client";

import { useState } from "react";
import { Toast } from "@/components/ui/Toast";
import {
  Users,
  Briefcase,
  CheckCircle2,
  Award,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowUpRight,
  UserCheck,
  Building2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string | null;
  }>({
    type: "success",
    message: "Data dashboard Central Saga berhasil disinkronisasi!",
  });

  const topPerformers = [
    { name: "Natalie McDermott", position: "UI/UX Designer", division: "Design", score: 93.0, grade: "A" },
    { name: "Manager Utama", position: "Senior Manager", division: "IT & Software", score: 90.7, grade: "A" },
    { name: "Miss Felicity Runte", position: "HR Specialist", division: "HR", score: 86.8, grade: "A" },
    { name: "Haskell Tromp II", position: "Backend Developer", division: "IT & Software", score: 82.4, grade: "B" },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification Popup */}
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, message: null })}
      />

      {/* Top Banner Header */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200 mb-2 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Central Saga Enterprise Audit v2.0</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Dashboard Overview — Performa.id
            </h1>
            <p className="text-sm text-blue-200/90 mt-1 max-w-xl">
              Ringkasan produktivitas, matriks pencapaian tugas, dan skor kriteria KPI pegawai secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() =>
                setToast({
                  type: "success",
                  message: "Sinkronisasi ulang data kinerja berhasil!",
                })
              }
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 active:scale-98 text-white rounded-xl text-xs font-bold transition-all border border-white/20 shadow-sm cursor-pointer"
            >
              Refresh Data
            </button>
            <a
              href="/tasks"
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>Kelola Tugas</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards (Match Visual Mockup) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Pegawai</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">24</p>
          <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 mt-1">
            +2 bulan ini
          </span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Tugas Bulan Ini</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">42</p>
          <span className="inline-flex items-center text-[11px] font-bold text-slate-500 mt-1">
            24 Pending • 18 In Progress
          </span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Task Completion</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">88.5%</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <TrendingUp className="w-3 h-3" /> +4.2% vs bulan lalu
          </span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Rata-rata Skor KPI</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900">87.2</p>
            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
              Grade A
            </span>
          </div>
          <span className="inline-flex items-center text-[11px] font-medium text-slate-400 mt-1">
            Target Organisasi: 85.0
          </span>
        </div>
      </div>

      {/* Main Analytics Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Performance Chart & Task Distribution (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grafik Tren Kinerja Bulanan */}
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Grafik Tren Kinerja Bulanan Central Saga
                </h3>
                <p className="text-xs text-slate-400">Periode Januari – Agustus 2026</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Target: 100%
              </span>
            </div>

            {/* High-Definition SVG Area Line Chart */}
            <div className="relative w-full pt-4 pb-2">
              <svg viewBox="0 0 500 160" className="w-full h-48 overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                <line x1="20" y1="30" x2="485" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="20" y1="70" x2="485" y2="70" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="20" y1="110" x2="485" y2="110" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="20" y1="150" x2="485" y2="150" stroke="#e2e8f0" strokeWidth="1" />

                {/* Area Gradient Fill */}
                <path
                  d="M 25 95 C 60 78, 60 78, 90 78 C 120 78, 125 88, 155 88 C 185 88, 190 62, 220 62 C 250 62, 255 52, 285 52 C 315 52, 320 60, 350 60 C 380 60, 385 40, 415 40 C 445 40, 450 32, 480 32 L 480 150 L 25 150 Z"
                  fill="url(#chartGradient)"
                />

                {/* Line Curve Path */}
                <path
                  d="M 25 95 C 60 78, 60 78, 90 78 C 120 78, 125 88, 155 88 C 185 88, 190 62, 220 62 C 250 62, 255 52, 285 52 C 315 52, 320 60, 350 60 C 380 60, 385 40, 415 40 C 445 40, 450 32, 480 32"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Glowing Data Dots */}
                {[
                  { x: 25, y: 95, val: "65%" },
                  { x: 90, y: 78, val: "72%" },
                  { x: 155, y: 88, val: "68%" },
                  { x: 220, y: 62, val: "78%" },
                  { x: 285, y: 52, val: "82%" },
                  { x: 350, y: 60, val: "79%" },
                  { x: 415, y: 40, val: "86%" },
                  { x: 480, y: 32, val: "88.5%" },
                ].map((pt, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="#1d4ed8" strokeWidth="3" />
                    <circle cx={pt.x} cy={pt.y} r="9" fill="#2563eb" opacity="0.2" className="group-hover:opacity-60 transition-opacity" />
                    <text x={pt.x} y={pt.y - 12} textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="bold">
                      {pt.val}
                    </text>
                  </g>
                ))}
              </svg>

              {/* X Axis Month Labels */}
              <div className="flex items-center justify-between px-2 pt-2 text-[11px] font-bold text-slate-500">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>Mei</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Ags</span>
              </div>
            </div>
          </div>

          {/* Top Performers Table / Leaderboard */}
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Top Performer Karyawan Bulan Ini</span>
                </h3>
                <p className="text-xs text-slate-400">Pegawai dengan skor evaluasi tertinggi</p>
              </div>
              <a href="/evaluations" className="text-xs font-semibold text-blue-600 hover:underline">
                Lihat Semua
              </a>
            </div>

            <div className="space-y-3">
              {topPerformers.map((emp, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-[10px]">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{emp.name}</p>
                      <p className="text-[11px] text-slate-400">{emp.position} • {emp.division}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-blue-700 text-sm">{emp.score}</span>
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                      Grade {emp.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed & Overdue Warning */}
        <div className="space-y-6">
          {/* Overdue Warning Alert Box */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Perhatian Overdue Task</h4>
                <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                  Terdapat 3 tugas berprioritas tinggi yang mendekati batas waktu deadline. Silakan periksa modul Manajemen Tugas.
                </p>
                <a href="/tasks" className="inline-block mt-2 text-xs font-bold text-amber-800 hover:underline">
                  Buka Tugas →
                </a>
              </div>
            </div>
          </div>

          {/* Activity Feed Timeline */}
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Feed Aktivitas Terbaru</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 relative pb-4 border-l-2 border-slate-100 pl-4 ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[6px] top-1" />
                <div>
                  <p className="font-semibold text-slate-800">
                    <span className="font-bold text-slate-900">Manager Utama</span> menyetujui tugas <span className="text-blue-600">Q3 Financial Audit</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">10 menit yang lalu</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative pb-4 border-l-2 border-slate-100 pl-4 ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[6px] top-1" />
                <div>
                  <p className="font-semibold text-slate-800">
                    <span className="font-bold text-slate-900">Natalie McDermott</span> mengumpulkan bukti kerja UI Design
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">45 menit yang lalu</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative pb-4 border-l-2 border-slate-100 pl-4 ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 absolute -left-[6px] top-1" />
                <div>
                  <p className="font-semibold text-slate-800">
                    <span className="font-bold text-slate-900">Admin System</span> menambahkan kriteria KPI baru
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">2 jam yang lalu</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative pl-4 ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 absolute -left-[6px] top-1" />
                <div>
                  <p className="font-semibold text-slate-800">
                    <span className="font-bold text-slate-900">Haskell Tromp II</span> memperbarui status tugas menjadi In Progress
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">3 jam yang lalu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
