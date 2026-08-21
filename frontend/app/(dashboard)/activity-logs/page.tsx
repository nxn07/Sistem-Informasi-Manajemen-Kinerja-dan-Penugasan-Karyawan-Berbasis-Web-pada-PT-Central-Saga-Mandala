"use client";

import { useState, useEffect, useRef } from "react";
import { auditLogService } from "@/services/audit-log-service";
import { ActivityLog } from "@/types/api";
import { Search, History, Sparkles, Clock } from "lucide-react";

interface AuditDisplayItem {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  isNew?: boolean;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<AuditDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const isFirstLoadRef = useRef(true);

  const loadAuditLogs = async () => {
    try {
      if (isFirstLoadRef.current) {
        setLoading(true);
      }
      const rawData = await auditLogService.getAll();
      const mapped: AuditDisplayItem[] = rawData.map((l: ActivityLog, idx: number) => {
        const userName = l.causer?.name || l.causer?.email || "System Admin";
        const dateStr = l.created_at ? new Date(l.created_at).toLocaleString("id-ID") : "19 Ags 2026, 18:15:00";
        const desc = l.description || "Aktivitas audit diproses";
        const modName = l.subject_type ? l.subject_type.split("\\").pop() || "System" : "Audit Module";

        return {
          id: l.id,
          timestamp: dateStr,
          user: userName,
          action: l.log_name || "LOGGED",
          module: modName,
          details: desc,
          // The top-most (most recent) log entry ALWAYS keeps 'isNew: true' until a newer log arrives!
          isNew: idx === 0,
        };
      });

      setLogs(mapped);
    } catch {
      // ignore
    } finally {
      if (isFirstLoadRef.current) {
        setLoading(false);
        isFirstLoadRef.current = false;
      }
    }
  };

  useEffect(() => {
    loadAuditLogs();
    // Mark sidebar badge counter as read upon visiting page
    auditLogService.markAsRead();

    // Auto-refresh audit logs every 2 seconds in real-time silently
    const interval = setInterval(() => {
      loadAuditLogs();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Audit Log Aktivitas Sistem Central Saga</span>
            <History className="w-6 h-6 text-blue-600 inline-block" />
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Catatan riwayat audit trail aktivitas penugasan, evaluasi, dan perubahan data pegawai.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-2xl text-xs font-black shadow-2xs shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>Live Auto-Sync Realtime (2s)</span>
        </div>
      </div>

      {/* Sleek Floating Toolbar Search Bar */}
      <div className="flex items-center justify-between gap-3 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari log berdasarkan user, aksi, atau detail..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-slate-900 shadow-2xs"
          />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-black shadow-xs shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          Total {filteredLogs.length} Audit Entries
        </span>
      </div>

      {/* ULTRA-ESTETIK EXECUTIVE TABLE VIEW */}
      <div className="bg-white border border-slate-300 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                <th className="py-4 px-4 w-12 border-r border-white/10 text-center">NO.</th>
                <th className="py-4 px-5 border-r border-white/10">TIMESTAMP</th>
                <th className="py-4 px-5 border-r border-white/10">USER</th>
                <th className="py-4 px-5 border-r border-white/10">AKSI</th>
                <th className="py-4 px-5 border-r border-white/10">MODUL</th>
                <th className="py-4 px-5">DETAIL AKTIVITAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/90 text-xs font-semibold">
              {filteredLogs.map((l, idx) => (
                <tr
                  key={l.id}
                  className={`transition-all duration-150 cursor-pointer group ${
                    l.isNew
                      ? "bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-white border-l-4 border-l-blue-600 font-bold"
                      : "even:bg-slate-50/70 hover:bg-blue-50/50"
                  }`}
                >
                  {/* NO. Column */}
                  <td className="py-4.5 px-4 text-slate-400 font-bold border-r border-slate-200 text-center">
                    {String(idx + 1).padStart(2, "0")}
                  </td>

                  {/* Timestamp Column */}
                  <td className="py-4.5 px-5 text-slate-600 border-r border-slate-200 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {l.timestamp}
                      </span>
                      {l.isNew && (
                        <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-blue-600 text-white shadow-2xs animate-pulse shrink-0">
                          ✨ BARU
                        </span>
                      )}
                    </div>
                  </td>

                  {/* User Column */}
                  <td className="py-4.5 px-5 border-r border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-900 text-white font-black flex items-center justify-center text-[10px] shrink-0 shadow-2xs">
                        {l.user.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {l.user}
                      </span>
                    </div>
                  </td>

                  {/* Aksi Badge Column */}
                  <td className="py-4.5 px-5 border-r border-slate-200">
                    <span className="px-3 py-1 text-[11px] font-extrabold rounded-lg bg-blue-50 text-blue-800 border border-blue-300 shadow-2xs uppercase">
                      {l.action}
                    </span>
                  </td>

                  {/* Modul Column */}
                  <td className="py-4.5 px-5 font-bold text-slate-700 border-r border-slate-200">
                    {l.module}
                  </td>

                  {/* Detail Aktivitas Column */}
                  <td className="py-4.5 px-5 text-slate-800 font-medium leading-relaxed">
                    {l.details}
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
