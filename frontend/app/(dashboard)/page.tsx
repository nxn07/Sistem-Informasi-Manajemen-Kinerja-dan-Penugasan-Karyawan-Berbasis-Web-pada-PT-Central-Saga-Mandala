"use client";

import { useState } from "react";
import Footer from "@/components/shared/Footer";
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
  BarChart3,
  LineChart,
  PieChart as PieChartIcon,
  Layers,
  Target,
} from "lucide-react";
import Image from "next/image";
import centralSagaLogo from "@/public/central-saga-logo.png";

export default function DashboardOverviewPage() {
  const [chartType, setChartType] = useState<"line" | "bar" | "donut">("line");
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

  const monthlyData = [
    { month: "Jan", score: 72, target: 80, completion: 68 },
    { month: "Feb", score: 78, target: 82, completion: 74 },
    { month: "Mar", score: 75, target: 85, completion: 80 },
    { month: "Apr", score: 84, target: 85, completion: 82 },
    { month: "Mei", score: 87, target: 88, completion: 89 },
    { month: "Jun", score: 85, target: 88, completion: 88 },
    { month: "Jul", score: 91, target: 90, completion: 92 },
    { month: "Ags", score: 93, target: 90, completion: 95 },
  ];

  const divisionDistribution = [
    { name: "IT & Software Development", percentage: 38, count: 9, color: "bg-blue-600", stroke: "#2563eb" },
    { name: "Finance & Accounting Risk", percentage: 25, count: 6, color: "bg-indigo-600", stroke: "#4f46e5" },
    { name: "Human Resources & Talent", percentage: 22, count: 5, color: "bg-teal-500", stroke: "#14b8a6" },
    { name: "Design & Product Marketing", percentage: 15, count: 4, color: "bg-purple-600", stroke: "#9333ea" },
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

      {/* 4 Stat Metric Cards (EXACT IMAGE 1 EXECUTIVE 3D CARDS & CRISP BORDERS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-500 transition-all duration-300 flex items-center justify-between group relative overflow-hidden cursor-pointer">
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
          <div>
            <span className="px-3 py-1 text-[10px] font-black rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs uppercase tracking-wider">
              Total Pegawai
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-2.5 tracking-tight">
              24
            </h3>
            <p className="text-[11px] font-extrabold text-emerald-700 mt-0.5">+2 bulan ini</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-800 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
            <Users className="w-6 h-6 text-blue-100" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-purple-500 transition-all duration-300 flex items-center justify-between group relative overflow-hidden cursor-pointer">
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />
          <div>
            <span className="px-3 py-1 text-[10px] font-black rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs uppercase tracking-wider">
              Tugas Bulan Ini
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-2.5 tracking-tight">
              42
            </h3>
            <p className="text-[11px] font-bold text-slate-500 mt-0.5">24 Pending • 18 In Progress</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-800 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
            <Briefcase className="w-6 h-6 text-purple-100" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-emerald-500 transition-all duration-300 flex items-center justify-between group relative overflow-hidden cursor-pointer">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
          <div>
            <span className="px-3 py-1 text-[10px] font-black rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs uppercase tracking-wider">
              Task Completion
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-2.5 tracking-tight">
              88.5%
            </h3>
            <p className="text-[11px] font-extrabold text-emerald-700 mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +4.2% vs bulan lalu
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-100" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-500 transition-all duration-300 flex items-center justify-between group relative overflow-hidden cursor-pointer">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
          <div>
            <span className="px-3 py-1 text-[10px] font-black rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs uppercase tracking-wider">
              Rata-rata Skor KPI
            </span>
            <div className="flex items-baseline gap-2 mt-2.5">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">87.2</h3>
              <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                Grade A
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Target Organisasi: 85.0</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
            <Award className="w-6 h-6 text-amber-100" />
          </div>
        </div>
      </div>

      {/* Main Analytics Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Multi-Format Performance Analytics Chart (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-xs space-y-4">
            {/* Header Toolbar & Chart Type Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Grafik Analitik Tren Kinerja Central Saga</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Visualisasi perbandingan realisasi kinerja, target KPI, dan distribusi divisi.
                </p>
              </div>

              {/* Chart Format Switcher Segmented Control */}
              <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/90 text-xs font-bold shrink-0 select-none">
                <button
                  onClick={() => setChartType("line")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    chartType === "line"
                      ? "bg-slate-900 text-white font-extrabold shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-semibold"
                  }`}
                >
                  <LineChart className="w-3.5 h-3.5" />
                  <span>Multi Line Area</span>
                </button>

                <button
                  onClick={() => setChartType("bar")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    chartType === "bar"
                      ? "bg-slate-900 text-white font-extrabold shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-semibold"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Column Bar</span>
                </button>

                <button
                  onClick={() => setChartType("donut")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    chartType === "donut"
                      ? "bg-slate-900 text-white font-extrabold shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-semibold"
                  }`}
                >
                  <PieChartIcon className="w-3.5 h-3.5" />
                  <span>Donut Divisi</span>
                </button>
              </div>
            </div>

            {/* Interactive Legend Bar */}
            {chartType !== "donut" ? (
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600 border border-blue-700 shadow-2xs" />
                  <span className="text-slate-800">Realisasi Kinerja Pegawai</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 border border-indigo-600 shadow-2xs" />
                  <span className="text-slate-800">Target KPI Organisasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600 shadow-2xs" />
                  <span className="text-slate-800">Task Completion Rate</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <span className="text-slate-700">Distribusi Kinerja Berdasarkan Divisi Departemen:</span>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 rounded-full border border-blue-300 text-[11px] font-extrabold">
                  Total 4 Divisi Resmi
                </span>
              </div>
            )}

            {/* DYNAMIC CHART DISPLAY BASED ON SELECTED FORMAT */}
            <div className="pt-2">
              {/* FORMAT 1: MULTI-LINE AREA CHART */}
              {chartType === "line" && (
                <div className="relative w-full pt-2">
                  <svg viewBox="0 0 500 160" className="w-full h-56 overflow-visible">
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Gridlines */}
                    <line x1="20" y1="30" x2="485" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="20" y1="70" x2="485" y2="70" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="20" y1="110" x2="485" y2="110" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="20" y1="150" x2="485" y2="150" stroke="#cbd5e1" strokeWidth="1" />

                    {/* Area 1: Blue Realisasi */}
                    <path
                      d="M 25 95 C 60 78, 60 78, 90 78 C 120 78, 125 88, 155 88 C 185 88, 190 62, 220 62 C 250 62, 255 52, 285 52 C 315 52, 320 60, 350 60 C 380 60, 385 40, 415 40 C 445 40, 450 32, 480 32 L 480 150 L 25 150 Z"
                      fill="url(#blueGradient)"
                    />

                    {/* Line 1: Blue Realisasi */}
                    <path
                      d="M 25 95 C 60 78, 60 78, 90 78 C 120 78, 125 88, 155 88 C 185 88, 190 62, 220 62 C 250 62, 255 52, 285 52 C 315 52, 320 60, 350 60 C 380 60, 385 40, 415 40 C 445 40, 450 32, 480 32"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Line 2: Indigo Dashed Target KPI */}
                    <path
                      d="M 25 75 C 60 72, 60 72, 90 72 C 120 72, 125 65, 155 65 C 185 65, 190 65, 220 65 C 250 65, 255 58, 285 58 C 315 58, 320 58, 350 58 C 380 58, 385 50, 415 50 C 445 50, 450 50, 480 50"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                    />

                    {/* Line 3: Emerald Task Completion */}
                    <path
                      d="M 25 105 C 60 90, 60 90, 90 85 C 120 85, 125 75, 155 75 C 185 75, 190 70, 220 70 C 250 70, 255 48, 285 48 C 315 48, 320 52, 350 52 C 380 52, 385 38, 415 38 C 445 38, 450 28, 480 28"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Data Points */}
                    {monthlyData.map((pt, i) => {
                      const xPos = 25 + i * 65;
                      return (
                        <g key={i}>
                          <circle cx={xPos} cy={150 - pt.score * 1.25} r="4.5" className="fill-white stroke-blue-600 stroke-[2.5]" />
                          <circle cx={xPos} cy={150 - pt.target * 1.25} r="3.5" className="fill-indigo-600" />
                          <circle cx={xPos} cy={150 - pt.completion * 1.25} r="3.5" className="fill-emerald-500" />
                          <text x={xPos} y="165" textAnchor="middle" className="text-[10px] font-bold fill-slate-400">
                            {pt.month}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}

              {/* FORMAT 2: MULTI-COLUMN BAR CHART */}
              {chartType === "bar" && (
                <div className="relative w-full pt-4 pb-2">
                  <div className="h-56 flex items-end justify-between gap-2 px-4 border-b border-slate-300 pb-2">
                    {monthlyData.map((pt, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="w-full flex items-end justify-center gap-1 h-44">
                          {/* Bar 1: Realisasi (Blue) */}
                          <div
                            style={{ height: `${pt.score * 1.6}px` }}
                            className="w-3.5 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-lg shadow-2xs group-hover:scale-105 transition-all"
                            title={`Realisasi ${pt.month}: ${pt.score}%`}
                          />
                          {/* Bar 2: Target KPI (Indigo) */}
                          <div
                            style={{ height: `${pt.target * 1.6}px` }}
                            className="w-3.5 bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-lg opacity-85 shadow-2xs group-hover:scale-105 transition-all"
                            title={`Target ${pt.month}: ${pt.target}%`}
                          />
                          {/* Bar 3: Task Completion (Emerald) */}
                          <div
                            style={{ height: `${pt.completion * 1.6}px` }}
                            className="w-3.5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg opacity-90 shadow-2xs group-hover:scale-105 transition-all"
                            title={`Completion ${pt.month}: ${pt.completion}%`}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{pt.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FORMAT 3: DONUT & PIE DIVISION DISTRIBUTION */}
              {chartType === "donut" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center pt-2">
                  {/* SVG Donut Ring */}
                  <div className="flex items-center justify-center relative">
                    <svg viewBox="0 0 100 100" className="w-44 h-44 -rotate-90">
                      <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="16" fill="transparent" strokeDasharray="90.7 238.7" strokeDashoffset="0" />
                      <circle cx="50" cy="50" r="38" stroke="#4f46e5" strokeWidth="16" fill="transparent" strokeDasharray="59.7 238.7" strokeDashoffset="-90.7" />
                      <circle cx="50" cy="50" r="38" stroke="#14b8a6" strokeWidth="16" fill="transparent" strokeDasharray="52.5 238.7" strokeDashoffset="-150.4" />
                      <circle cx="50" cy="50" r="38" stroke="#9333ea" strokeWidth="16" fill="transparent" strokeDasharray="35.8 238.7" strokeDashoffset="-202.9" />
                    </svg>
                    <div className="absolute text-center">
                      <p className="text-2xl font-black text-slate-900">24</p>
                      <p className="text-[10px] font-bold text-slate-400">Pegawai</p>
                    </div>
                  </div>

                  {/* Division Breakdown Legend Cards */}
                  <div className="space-y-2 text-xs">
                    {divisionDistribution.map((div, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between hover:bg-blue-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-lg ${div.color} shadow-2xs`} />
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{div.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{div.count} Anggota Pegawai</p>
                          </div>
                        </div>
                        <span className="font-extrabold text-blue-900 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                          {div.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
