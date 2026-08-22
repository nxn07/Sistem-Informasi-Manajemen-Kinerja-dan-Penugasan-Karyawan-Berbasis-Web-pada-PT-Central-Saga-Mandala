"use client";

import { Server } from "lucide-react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 md:left-64 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 text-slate-700 text-xs py-3 px-6 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Column: Official Brand Logo & Copyright Info */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white p-1 flex items-center justify-center border border-emerald-500/40 shadow-2xs shrink-0 ring-2 ring-emerald-500/10">
            <img src="/central-saga-logo.png" alt="Central Saga" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-xs">
                Central Saga — Enterprise Performance
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                v2.0 Official
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              © 2026 Central Saga Inc. Sistem Informasi Kinerja & Audit Pegawai (SIM-KAP). Hak Cipta Dilindungi.
            </p>
          </div>
        </div>

        {/* Right Column: Server Health & Quick Nav Links */}
        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 rounded-full border border-emerald-300 shadow-2xs">
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            <span>Server PostgreSQL 16.2 Active</span>
          </div>

          <a href="/settings" className="hover:text-blue-700 hover:underline transition-colors">
            Pengaturan
          </a>
        </div>
      </div>
    </footer>
  );
}
