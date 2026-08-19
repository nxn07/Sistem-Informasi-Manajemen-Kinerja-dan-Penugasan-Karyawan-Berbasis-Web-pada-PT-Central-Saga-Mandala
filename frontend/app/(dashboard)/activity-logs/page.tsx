"use client";

import { useState } from "react";
import { Toast } from "@/components/ui/Toast";
import { History, Search, Filter, ShieldCheck, Clock } from "lucide-react";

export default function ActivityLogsPage() {
  const [logs] = useState([
    {
      id: 1,
      timestamp: "19 Ags 2026, 14:30 WIB",
      user: "Manager Utama",
      action: "Approved Task",
      module: "Tasks Module",
      ip: "192.168.1.10",
      details: "Menyetujui tugas Q3 Financial Audit Report",
    },
    {
      id: 2,
      timestamp: "19 Ags 2026, 14:15 WIB",
      user: "Natalie McDermott",
      action: "Submitted Task",
      module: "Tasks Module",
      ip: "192.168.1.15",
      details: "Mengumpulkan bukti kerja UI Design Mockup",
    },
    {
      id: 3,
      timestamp: "19 Ags 2026, 13:00 WIB",
      user: "Admin System",
      action: "Updated KPI Criteria",
      module: "KPI Module",
      ip: "192.168.1.1",
      details: "Memperbarui bobot kriteria Kedisiplinan menjadi 25%",
    },
    {
      id: 4,
      timestamp: "19 Ags 2026, 11:20 WIB",
      user: "Haskell Tromp II",
      action: "Status Changed",
      module: "Tasks Module",
      ip: "192.168.1.20",
      details: "Mengubah status tugas Server Migration ke IN_PROGRESS",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = logs.filter(
    (l) =>
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Audit Log Aktivitas Sistem Central Saga
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Catatan riwayat audit trail aktivitas penugasan, evaluasi, dan perubahan data pegawai.
        </p>
      </div>

      <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari log berdasarkan user, aksi, atau detail..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Showing {filteredLogs.length} audit entries
        </span>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">TIMESTAMP</th>
                <th className="py-3.5 px-4">USER</th>
                <th className="py-3.5 px-4">AKSI</th>
                <th className="py-3.5 px-4">MODUL</th>
                <th className="py-3.5 px-4">DETAIL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 text-slate-400 font-semibold whitespace-nowrap">
                    {l.timestamp}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">{l.user}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      {l.action}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-600">{l.module}</td>
                  <td className="py-4 px-4 text-slate-800">{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
