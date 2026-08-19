"use client";

import { useState } from "react";
import { Building2, Plus, Users, Search } from "lucide-react";

interface DivisionItem {
  id: number;
  code: string;
  name: string;
  description: string;
  total_members: number;
}

const mockDivisions: DivisionItem[] = [
  {
    id: 1,
    code: "DIV-IT",
    name: "Information Technology",
    description: "Pengembangan perangkat lunak, infrastruktur server & jaringan.",
    total_members: 8,
  },
  {
    id: 2,
    code: "DIV-HR",
    name: "Human Resources",
    description: "Pengelolaan SDM, rekrutmen, pelatihan, dan kesejahteraan pegawai.",
    total_members: 4,
  },
  {
    id: 3,
    code: "DIV-FIN",
    name: "Finance & Accounting",
    description: "Pengelolaan keuangan, pembukuan, dan audit anggaran.",
    total_members: 5,
  },
  {
    id: 4,
    code: "DIV-MKT",
    name: "Marketing & Growth",
    description: "Pemasaran produk, hubungan masyarakat, dan strategi promosi.",
    total_members: 6,
  },
];

export default function DivisionsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockDivisions.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Master Data Divisi
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola struktur departemen dan unit kerja di lingkungan organisasi
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer shrink-0">
          <Plus className="w-4 h-4" />
          <span>Tambah Divisi</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama atau kode divisi..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Divisions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 rounded-lg">
                  {item.code}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {item.total_members} Anggota
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>{item.name}</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
