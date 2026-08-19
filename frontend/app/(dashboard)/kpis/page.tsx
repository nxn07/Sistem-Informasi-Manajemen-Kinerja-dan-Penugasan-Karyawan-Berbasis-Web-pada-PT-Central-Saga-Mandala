"use client";

import { useState } from "react";
import { Target, Plus, PieChart } from "lucide-react";

interface KpiItem {
  id: number;
  name: string;
  weight_percentage: number;
  description: string;
}

const mockKpis: KpiItem[] = [
  {
    id: 1,
    name: "Kedisiplinan & Ketepatan Waktu",
    weight_percentage: 25,
    description: "Tingkat kehadiran, kehadiran rapat, dan kepatuhan jam kerja.",
  },
  {
    id: 2,
    name: "Kualitas Hasil Kerja (Quality of Deliverables)",
    weight_percentage: 30,
    description: "Ketetapan standar mutu output pekerjaan dan keakuratan data/kode.",
  },
  {
    id: 3,
    name: "Kerjasama Tim & Komunikasi",
    weight_percentage: 25,
    description: "Kolaborasi antar departemen, responsivitas, dan komunikasi efektif.",
  },
  {
    id: 4,
    name: "Inisiatif & Inovasi Kerja",
    weight_percentage: 20,
    description: "Proaktif mengajukan ide perbaikan proses kerja dan solusi problem-solving.",
  },
];

export default function KpiPage() {
  const totalWeight = mockKpis.reduce((acc, k) => acc + k.weight_percentage, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kriteria & Bobot KPI
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pengaturan indikator kinerja utama (Key Performance Indicators)
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer shrink-0">
          <Plus className="w-4 h-4" />
          <span>Tambah Kriteria KPI</span>
        </button>
      </div>

      {/* Summary Total Weight Banner */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Total Bobot Indikator KPI
            </h4>
            <p className="text-xs text-slate-500">
              Akumulasi persentase bobot kriteria penilaian bulanan
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-extrabold text-purple-700">
            {totalWeight}%
          </span>
          <p className="text-[11px] text-slate-400 font-medium">Target: 100%</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockKpis.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200/80 rounded-full">
                  Bobot: {item.weight_percentage}%
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{item.name}</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
