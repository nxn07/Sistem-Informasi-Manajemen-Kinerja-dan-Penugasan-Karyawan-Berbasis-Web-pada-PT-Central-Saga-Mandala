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
import Image from "next/image";
import centralSagaLogo from "@/public/central-saga-logo.png";

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
      <div className="p-8 bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 text-white rounded-3xl shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/3 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-1.5 flex items-center justify-center shrink-0 border border-emerald-400/40 shadow-lg">
              <Image src={centralSagaLogo} alt="Central Saga" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-blue-200 mb-2 border border-white/15 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
                <span>Central Saga Enterprise Audit v2.0</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-xs">
                Dashboard Overview — <span className="text-emerald-400">Central Saga</span>
              </h1>
              <p className="text-xs md:text-sm text-blue-200/90 mt-1 max-w-xl font-medium leading-relaxed">
                Ringkasan produktivitas, matriks pencapaian tugas, dan skor kriteria KPI pegawai secara real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() =>
                setToast({
                  type: "success",
                  message: "Sinkronisasi ulang data kinerja berhasil!",
                })
              }
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl text-xs font-bold transition-all border border-white/20 shadow-sm cursor-pointer"
            >
              Refresh Data
            </button>
            <a
              href="/tasks"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white rounded-xl text-xs font-extrabold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <span>Kelola Tugas</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards (ULTRA-AESTHETIC EXECUTIVE CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-gradient-to-br from-white to-blue-50/30 border border-slate-300 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-blue-900">Total Pegawai</span>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200 shadow-2xs group-hover:scale-110 group-hover:rotate-3 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">24</p>
          <span className="inline-flex items-center text-[11px] font-extrabold text-emerald-700 mt-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300 shadow-2xs">
            +2 bulan ini
          </span>
        </div>

        <div className="p-5 bg-gradient-to-br from-white to-purple-50/30 border border-slate-300 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-purple-500 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-purple-900">Tugas Bulan Ini</span>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-200 shadow-2xs group-hover:scale-110 group-hover:rotate-3 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">42</p>
          <span className="inline-flex items-center text-[11px] font-bold text-slate-600 mt-1 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-300 shadow-2xs">
            24 Pending • 18 In Progress
          </span>
        </div>

        <div className="p-5 bg-gradient-to-br from-white to-emerald-50/30 border border-slate-300 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-emerald-900">Task Completion</span>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200 shadow-2xs group-hover:scale-110 group-hover:rotate-3 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">88.5%</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 mt-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300 shadow-2xs">
            <TrendingUp className="w-3 h-3" /> +4.2% vs bulan lalu
          </span>
        </div>

        <div className="p-5 bg-gradient-to-br from-white to-amber-50/30 border border-slate-300 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-amber-500 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-amber-900">Rata-rata Skor KPI</span>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200 shadow-2xs group-hover:scale-110 group-hover:rotate-3 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900">87.2</p>
            <span className="px-2 py-0.5 text-xs font-extrabold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 shadow-2xs">
              Grade A
            </span>
          </div>
          <span className="inline-flex items-center text-[11px] font-semibold text-slate-500 mt-1">
            Target Organisasi: 85.0
          </span>
        </div>
      </div>

      {/* Main Analytics Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Performance Chart & Task Distribution (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grafik Tren Kinerja Bulanan */}
          <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Grafik Tren Kinerja Bulanan Central Saga</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium">Periode Januari – Agustus 2026</p>
              </div>
              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-300 shadow-2xs">
                Target: 100%
              </span>
            </div>

            {/* High-Definition SVG Area Line Chart */}
            <div className="relative w-full pt-4 pb-2">
              <svg viewBox="0 0 500 160" className="w-full h-52 overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.38" />
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
                <line x1="20" y1="150" x2="485" y2="150" stroke="#cbd5e1" strokeWidth="1" />

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

                {/* Data Points Circles */}
                {[
                  { x: 25, y: 95, label: "Jan", val: "72%" },
                  { x: 90, y: 78, label: "Feb", val: "78%" },
                  { x: 155, y: 88, label: "Mar", val: "75%" },
                  { x: 220, y: 62, label: "Apr", val: "84%" },
                  { x: 285, y: 52, label: "Mei", val: "87%" },
                  { x: 350, y: 60, label: "Jun", val: "85%" },
                  { x: 415, y: 40, label: "Jul", val: "91%" },
                  { x: 480, y: 32, label: "Ags", val: "93%" },
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="5" className="fill-white stroke-blue-700 stroke-[3]" />
                    <text x={pt.x} y="165" textAnchor="middle" className="text-[10px] font-bold fill-slate-400">
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Top Performers (1 Col) */}
        <div className="space-y-6">
          <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Pegawai Terbaik (Top 4)</span>
              </h3>
              <a href="/evaluations" className="text-[11px] font-extrabold text-blue-600 hover:underline">
                Lihat Semua
              </a>
            </div>

            <div className="space-y-3">
              {topPerformers.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-300 rounded-2xl flex items-center justify-between hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-black flex items-center justify-center text-xs shadow-2xs">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.position} • {p.division}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-blue-900 text-xs">{p.score}</p>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Grade {p.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
