"use client";

import { useState, useEffect } from "react";
import { Toast } from "@/components/ui/Toast";
import { kpiService } from "@/services/kpi-service";
import { KpiCriteria } from "@/types/api";
import { Target, Plus, PieChart, X, Edit3, Trash2 } from "lucide-react";

export default function KpiPage() {
  const [kpiList, setKpiList] = useState<KpiCriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKpiForEdit, setSelectedKpiForEdit] = useState<KpiCriteria | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [nameInput, setNameInput] = useState("");
  const [weightInput, setWeightInput] = useState(20);
  const [descriptionInput, setDescriptionInput] = useState("");

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string | null;
  }>({
    type: "success",
    message: null,
  });

  const loadKpiData = async () => {
    try {
      setLoading(true);
      const data = await kpiService.getAll();
      setKpiList(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKpiData();
  }, []);

  const totalWeight = kpiList.reduce((acc, k) => acc + (k.weight_percentage || k.weight || 0), 0);

  const handleOpenEdit = (item: KpiCriteria) => {
    setSelectedKpiForEdit(item);
    setNameInput(item.criteria_name || item.name || "");
    setWeightInput(item.weight_percentage || item.weight || 20);
    setDescriptionInput(item.description || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKpiForEdit) return;

    try {
      const updated = await kpiService.update(selectedKpiForEdit.id, {
        criteria_name: nameInput,
        name: nameInput,
        weight_percentage: Number(weightInput),
        weight: Number(weightInput),
        description: descriptionInput,
      });

      setKpiList((prev) =>
        prev.map((k) => (k.id === selectedKpiForEdit.id ? updated : k))
      );

      setSelectedKpiForEdit(null);
      setToast({
        type: "success",
        message: `Indikator KPI '${nameInput}' berhasil diperbarui!`,
      });
    } catch {
      setToast({
        type: "error",
        message: `Gagal mengedit KPI.`,
      });
    }
  };

  const handleCreateKpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput) return;

    try {
      const created = await kpiService.create({
        criteria_name: nameInput,
        name: nameInput,
        weight_percentage: Number(weightInput),
        weight: Number(weightInput),
        description: descriptionInput || "Indikator kinerja utama departemen Central Saga.",
      });

      setKpiList((prev) => [...prev, created]);
      setIsCreateOpen(false);
      setNameInput("");
      setWeightInput(15);
      setDescriptionInput("");
      setToast({
        type: "success",
        message: `Indikator KPI baru '${nameInput}' berhasil ditambahkan!`,
      });
    } catch {
      setToast({
        type: "error",
        message: "Gagal membuat indikator KPI baru.",
      });
    }
  };

  const handleDeleteKpi = async (id: number, name?: string) => {
    const displayName = name || "Kriteria";
    if (confirm(`Apakah Anda yakin ingin menghapus indikator KPI ${displayName}?`)) {
      try {
        await kpiService.delete(id);
        setKpiList((prev) => prev.filter((k) => k.id !== id));
        setToast({
          type: "success",
          message: `Indikator KPI '${displayName}' berhasil dihapus!`,
        });
      } catch {
        setToast({
          type: "error",
          message: `Gagal menghapus KPI '${displayName}'.`,
        });
      }
    }
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
            Kriteria & Bobot KPI Central Saga
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Pengaturan indikator kinerja utama (Key Performance Indicators)
          </p>
        </div>

        <button
          onClick={() => {
            setNameInput("");
            setWeightInput(15);
            setDescriptionInput("");
            setIsCreateOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 border border-blue-950"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kriteria KPI</span>
        </button>
      </div>

      {/* Summary Total Weight Banner (Crisp 1px Border & Shadow) */}
      <div className="p-5 bg-white border border-slate-300 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-200 shadow-2xs">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Total Bobot Indikator KPI
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Akumulasi persentase bobot kriteria penilaian bulanan
            </p>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`text-2xl font-black ${
              totalWeight === 100 ? "text-purple-700" : "text-rose-600"
            }`}
          >
            {totalWeight}%
          </span>
          <p className="text-[11px] text-slate-400 font-bold">Target: 100%</p>
        </div>
      </div>

      {/* KPI Cards Grid (Crisp 1px Border & Floating Shadow) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {kpiList.map((item) => {
          const displayName = item.criteria_name || item.name || "Kriteria";
          const displayWeight = item.weight_percentage || item.weight || 0;

          return (
            <div
              key={item.id}
              className="p-5 bg-white border border-slate-300 rounded-2xl shadow-sm hover:shadow-lg hover:border-purple-400 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-300 rounded-full shadow-2xs">
                    Bobot: {displayWeight}%
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                      title="Edit KPI"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteKpi(item.id, displayName)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                      title="Hapus KPI"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-2 group-hover:text-purple-700 transition-colors">
                  <Target className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{displayName}</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {item.description || "Penjelasan detail indikator penilaian."}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Popup: Tambah / Edit Kriteria KPI */}
      {(isCreateOpen || selectedKpiForEdit) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-300 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {isCreateOpen ? "Tambah Kriteria KPI Baru" : "Edit Kriteria & Bobot KPI"}
              </h3>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  setSelectedKpiForEdit(null);
                }}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isCreateOpen ? handleCreateKpi : handleSaveEdit}
              className="space-y-4 text-xs font-medium"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Indikator KPI <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Kualitas Hasil Kerja..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Persentase Bobot (%) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={weightInput}
                  onChange={(e) => setWeightInput(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deskripsi & Penjelasan Kriteria
                </label>
                <textarea
                  rows={3}
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="Penjelasan detail indikator penilaian..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setSelectedKpiForEdit(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md border border-purple-800"
                >
                  {isCreateOpen ? "Simpan Indikator" : "Update Bobot KPI"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
