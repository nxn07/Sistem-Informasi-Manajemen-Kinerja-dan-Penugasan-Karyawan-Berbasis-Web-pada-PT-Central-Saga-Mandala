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

            {/* Visual Line Chart Graphic Mockup */}
            <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
              {[
                { month: "Jan", val: 65 },
                { month: "Feb", val: 72 },
                { month: "Mar", val: 68 },
                { month: "Apr", val: 78 },
                { month: "Mei", val: 82 },
                { month: "Jun", val: 79 },
                { month: "Jul", val: 86 },
                { month: "Ags", val: 88.5 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.val}%
                  </div>
                  <div
                    style={{ height: `${item.val}%` }}
                    className={`w-full max-w-[28px] rounded-t-lg transition-all group-hover:brightness-110 ${
                      idx === 7
                        ? "bg-gradient-to-t from-blue-600 to-indigo-600 shadow-md"
                        : "bg-blue-100 hover:bg-blue-200"
                    }`}
                  />
                  <span className="text-[11px] font-semibold text-slate-500 mt-1">{item.month}</span>
                </div>
              ))}
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
