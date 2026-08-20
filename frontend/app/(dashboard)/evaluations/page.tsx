"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Toast } from "@/components/ui/Toast";
import { evaluationService } from "@/services/evaluation-service";
import { PerformanceEvaluation } from "@/types/api";
import { Award, TrendingUp, Calendar, Search, Filter, Plus, X, Lock } from "lucide-react";

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

export default function EvaluationsPage() {
  const { user } = useAuth();
  const rawRole = (user?.role || user?.roles?.[0] || "ADMIN").toUpperCase();
  const isEmployee = rawRole === "EMPLOYEE";
  const isAdminOrManager = !isEmployee;
  const currentUserName = user?.name || "Sarah Jenkins";

  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State inside Modal
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("Haskell Tromp II");
  const [taskScoreInput, setTaskScoreInput] = useState(88);
  const [k1, setK1] = useState(85); // Kedisiplinan
  const [k2, setK2] = useState(90); // Kualitas Kerja
  const [k3, setK3] = useState(85); // Kerjasama
  const [k4, setK4] = useState(80); // Inovasi

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string | null;
  }>({
    type: "success",
    message: null,
  });

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const rawData = await evaluationService.getAll();
      const mapped: EvaluationItem[] = rawData.map((e: PerformanceEvaluation) => {
        const empName = e.employee?.full_name || e.employee?.name || "Pegawai Central Saga";
        const pos = e.employee?.position || "Specialist Staff";
        const div = e.employee?.division?.name || "Operasional Central Saga";
        const scoreVal = Number(e.score) || 85.0;
        const taskSc = scoreVal;
        const kpiSc = scoreVal;
        const finalSc = taskSc * 0.6 + kpiSc * 0.4;
        const gr = calculateGrade(finalSc);

        return {
          id: e.id,
          employee_name: empName,
          position: pos,
          division: div,
          task_score: taskSc,
          kpi_score: kpiSc,
          final_score: finalSc,
          grade: gr,
          period: "Agustus 2026",
        };
      });

      setEvaluations(mapped);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluations();
  }, []);

  // Calculate live average KPI score and final score
  const avgKpiScore = (k1 + k2 + k3 + k4) / 4;
  const calculatedFinalScore = taskScoreInput * 0.6 + avgKpiScore * 0.4;

  const calculateGrade = (score: number): "A" | "B" | "C" | "D" | "E" => {
    if (score >= 85) return "A";
    if (score >= 75) return "B";
    if (score >= 65) return "C";
    if (score >= 50) return "D";
    return "E";
  };

  const currentGrade = calculateGrade(calculatedFinalScore);

  const filtered = evaluations.filter((item) => {
    if (isEmployee) {
      const isOwn =
        item.employee_name.toLowerCase().includes(currentUserName.toLowerCase()) ||
        currentUserName.toLowerCase().includes(item.employee_name.toLowerCase());
      if (!isOwn) return false;
    }

    const matchesSearch =
      item.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      item.position.toLowerCase().includes(search.toLowerCase()) ||
      item.division.toLowerCase().includes(search.toLowerCase());

    const matchesGrade = selectedGrade === "ALL" || item.grade === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  const handleCreateEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await evaluationService.create({
        task_id: 1,
        employee_id: 1,
        score: calculatedFinalScore,
        feedback_notes: `Evaluasi diterbitkan untuk ${selectedEmployeeName}. Grade: ${currentGrade}`,
      });

      const newEval: EvaluationItem = {
        id: Date.now(),
        employee_name: selectedEmployeeName,
        position: "Specialist Staff",
        division: "Central Saga Unit",
        task_score: taskScoreInput,
        kpi_score: avgKpiScore,
        final_score: calculatedFinalScore,
        grade: currentGrade,
        period: "Agustus 2026",
      };

      setEvaluations((prev) => [newEval, ...prev]);
      setIsCreateOpen(false);
      setToast({
        type: "success",
        message: `Hasil Evaluasi Kinerja Pegawai '${selectedEmployeeName}' (Skor: ${calculatedFinalScore.toFixed(
          1
        )} - Grade ${currentGrade}) Berhasil Diterbitkan!`,
      });
    } catch {
      setToast({
        type: "error",
        message: "Gagal menerbitkan evaluasi.",
      });
    }
  };

  const getGradeBadge = (grade: string) => {
    const styles: Record<string, string> = {
      A: "bg-emerald-100 text-emerald-800 border border-emerald-300",
      B: "bg-blue-100 text-blue-800 border border-blue-300",
      C: "bg-amber-100 text-amber-800 border border-amber-300",
      D: "bg-orange-100 text-orange-800 border border-orange-300",
      E: "bg-rose-100 text-rose-800 border border-rose-300",
    };

    return (
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-2xs ${
          styles[grade] || "bg-slate-100 text-slate-800 border border-slate-300"
        }`}
      >
        {grade}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Popup */}
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, message: null })}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Evaluasi Kinerja Pegawai Central Saga
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEmployee
              ? "Kartu skor hasil evaluasi kinerja mandiri Anda."
              : "Kartu skor evaluasi bulanan berbasis kalkulasi Task (60%) & KPI (40%)"}
          </p>
        </div>

        {isAdminOrManager && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Evaluasi Baru</span>
          </button>
        )}
      </div>

      {/* Privacy Notice Banner for Employee */}
      {isEmployee && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-bold shadow-2xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Hak Akses Terproteksi (Private Mode): Anda hanya dapat melihat kartu evaluasi kinerja Anda sendiri. Evaluasi pegawai lain bersifat rahasia.</span>
          </div>
        </div>
      )}

      {/* Formula Explanation Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-center gap-3">
        <div className="p-3 bg-blue-600 text-white rounded-xl shadow-xs">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-slate-900">
            Rumus Formula Skor Akhir SIM-KAP
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            <span className="font-bold text-blue-700">Final Score</span> = (Skor Tugas × 60%) + (Skor Kriteria KPI × 40%). Grade: A (≥85), B (75-84.9), C (65-74.9), D (50-64.9), E (&lt;50).
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
            className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white font-semibold text-slate-700 cursor-pointer"
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

      {/* Evaluation Scorecard Table (Clean Subtle Borders) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 border-r border-slate-200/60">Pegawai</th>
                <th className="py-3.5 px-4 border-r border-slate-200/60">Divisi</th>
                <th className="py-3.5 px-4 border-r border-slate-200/60">Periode</th>
                <th className="py-3.5 px-4 text-center border-r border-slate-200/60">Skor Tugas (60%)</th>
                <th className="py-3.5 px-4 text-center border-r border-slate-200/60">Skor KPI (40%)</th>
                <th className="py-3.5 px-4 text-center border-r border-slate-200/60">Skor Akhir</th>
                <th className="py-3.5 px-4 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="even:bg-slate-50/50 hover:bg-slate-50/90 transition-colors">
                  <td className="py-4 px-4 border-r border-slate-100">
                    <p className="font-bold text-slate-900">{item.employee_name}</p>
                    <p className="text-[11px] text-slate-400">{item.position}</p>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-semibold border-r border-slate-100">
                    {item.division}
                  </td>
                  <td className="py-4 px-4 text-slate-500 border-r border-slate-100">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.period}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-800 border-r border-slate-100">
                    {item.task_score.toFixed(1)}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-800 border-r border-slate-100">
                    {item.kpi_score.toFixed(1)}
                  </td>
                  <td className="py-4 px-4 text-center border-r border-slate-100">
                    <span className="inline-flex items-center gap-1 font-black text-blue-700 text-sm bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
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

      {/* Modal Popup: Buat Evaluasi Kinerja Bulanan Baru */}
      {isCreateOpen && isAdminOrManager && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Buat Evaluasi Kinerja Bulanan Baru
                  </h3>
                  <p className="text-xs text-slate-400">Kalkulasi skor otomatis Task (60%) + KPI (40%)</p>
                </div>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvaluation} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Pegawai *</label>
                  <select
                    value={selectedEmployeeName}
                    onChange={(e) => setSelectedEmployeeName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Haskell Tromp II">Haskell Tromp II (Backend)</option>
                    <option value="Sarah Jenkins">Sarah Jenkins (Finance)</option>
                    <option value="Michael Ross">Michael Ross (IT Ops)</option>
                    <option value="Natalie McDermott">Natalie McDermott (UI/UX)</option>
                    <option value="Van Larkin">Van Larkin (QA)</option>
                    <option value="Miss Felicity Runte">Miss Felicity Runte (HR)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Skor Tugas (60%) *</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={taskScoreInput}
                    onChange={(e) => setTaskScoreInput(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Sliders for KPI Criteria */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs flex items-center justify-between">
                  <span>Penilaian KPI Indikator (40%)</span>
                  <span className="text-blue-600 font-bold">Rata-rata: {avgKpiScore.toFixed(1)}</span>
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Kedisiplinan & Ketepatan Waktu:</span>
                    <span className="font-bold text-slate-900">{k1}</span>
                  </div>
                  <input type="range" min="0" max="100" value={k1} onChange={(e) => setK1(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Kualitas Hasil Kerja:</span>
                    <span className="font-bold text-slate-900">{k2}</span>
                  </div>
                  <input type="range" min="0" max="100" value={k2} onChange={(e) => setK2(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Kerjasama Tim & Komunikasi:</span>
                    <span className="font-bold text-slate-900">{k3}</span>
                  </div>
                  <input type="range" min="0" max="100" value={k3} onChange={(e) => setK3(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Inisiatif & Inovasi Kerja:</span>
                    <span className="font-bold text-slate-900">{k4}</span>
                  </div>
                  <input type="range" min="0" max="100" value={k4} onChange={(e) => setK4(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                </div>
              </div>

              {/* Projected Final Score Box */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-blue-900">Proyeksi Skor Akhir</p>
                  <p className="text-[10px] text-blue-700">Formula: (Tugas 60%) + (KPI 40%)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-blue-900">{calculatedFinalScore.toFixed(1)}</span>
                  {getGradeBadge(currentGrade)}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Terbitkan Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
