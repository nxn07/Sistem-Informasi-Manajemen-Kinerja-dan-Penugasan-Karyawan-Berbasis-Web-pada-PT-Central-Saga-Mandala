"use client";

import { useState } from "react";
import { Award, TrendingUp, Calendar, Search, Filter } from "lucide-react";

interface EvaluationItem {
  id: number;
  employee_name: string;
  position: string;
  division: string;
  task_score: number;
  kpi_score: number;
  final_score: number;
  grade: "A" | "B" | "C" | "D" | "E";
  period: string;
}

const mockEvaluations: EvaluationItem[] = [
  {
    id: 1,
    employee_name: "Manager Utama",
    position: "Senior Manager",
    division: "IT & Software",
    task_score: 92.5,
    kpi_score: 88.0,
    final_score: 90.7,
    grade: "A",
    period: "Agustus 2026",
  },
  {
    id: 2,
    employee_name: "Haskell Tromp II",
    position: "Backend Developer",
    division: "IT & Software",
    task_score: 84.0,
    kpi_score: 80.0,
    final_score: 82.4,
    grade: "B",
    period: "Agustus 2026",
  },
  {
    id: 3,
    employee_name: "Natalie McDermott",
    position: "UI/UX Designer",
    division: "Design & Product",
    task_score: 95.0,
    kpi_score: 90.0,
    final_score: 93.0,
    grade: "A",
    period: "Agustus 2026",
  },
  {
    id: 4,
    employee_name: "Van Larkin",
    position: "QA Engineer",
    division: "Quality Assurance",
    task_score: 72.0,
    kpi_score: 75.0,
    final_score: 73.2,
    grade: "C",
    period: "Agustus 2026",
  },
  {
    id: 5,
    employee_name: "Miss Felicity Runte",
    position: "HR Specialist",
    division: "Human Resources",
    task_score: 88.0,
    kpi_score: 85.0,
    final_score: 86.8,
    grade: "A",
    period: "Agustus 2026",
  },
];

export default function EvaluationsPage() {
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("ALL");

  const filtered = mockEvaluations.filter((item) => {
    const matchesSearch =
      item.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      item.position.toLowerCase().includes(search.toLowerCase()) ||
      item.division.toLowerCase().includes(search.toLowerCase());

    const matchesGrade = selectedGrade === "ALL" || item.grade === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  const getGradeBadge = (grade: string) => {
    const styles: Record<string, string> = {
      A: "bg-emerald-100 text-emerald-800 border-emerald-300",
      B: "bg-blue-100 text-blue-800 border-blue-300",
      C: "bg-amber-100 text-amber-800 border-amber-300",
      D: "bg-orange-100 text-orange-800 border-orange-300",
      E: "bg-rose-100 text-rose-800 border-rose-300",
    };

    return (
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border shadow-2xs ${
          styles[grade] || "bg-slate-100 text-slate-800"
        }`}
      >
        {grade}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Evaluasi Kinerja Pegawai
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kartu skor evaluasi bulanan berbasis kalkulasi Task (60%) & KPI (40%)
          </p>
        </div>
      </div>

      {/* Formula Explanation Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex items-center gap-3">
        <div className="p-3 bg-blue-600 text-white rounded-xl">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Rumus Formula Skor Akhir SIM-KAP
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            <span className="font-semibold text-blue-700">Final Score</span> = (Skor Tugas × 60%) + (Skor Kriteria KPI × 40%). Grade: A (≥85), B (75-84.9), C (65-74.9), D (50-64.9), E (&lt;50).
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pegawai, jabatan, atau divisi..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white font-medium text-slate-700"
          >
            <option value="ALL">Semua Grade</option>
            <option value="A">Grade A (≥85)</option>
            <option value="B">Grade B (75-84.9)</option>
            <option value="C">Grade C (65-74.9)</option>
            <option value="D">Grade D (50-64.9)</option>
            <option value="E">Grade E (&lt;50)</option>
          </select>
        </div>
      </div>

      {/* Evaluation Scorecard Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Pegawai</th>
                <th className="py-3.5 px-4">Divisi</th>
                <th className="py-3.5 px-4">Periode</th>
                <th className="py-3.5 px-4 text-center">Skor Tugas (60%)</th>
                <th className="py-3.5 px-4 text-center">Skor KPI (40%)</th>
                <th className="py-3.5 px-4 text-center">Skor Akhir</th>
                <th className="py-3.5 px-4 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">{item.employee_name}</p>
                    <p className="text-[11px] text-slate-400">{item.position}</p>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    {item.division}
                  </td>
                  <td className="py-4 px-4 text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.period}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-slate-700">
                    {item.task_score.toFixed(1)}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-slate-700">
                    {item.kpi_score.toFixed(1)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-blue-600 text-sm">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                      {item.final_score.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center">
                      {getGradeBadge(item.grade)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
