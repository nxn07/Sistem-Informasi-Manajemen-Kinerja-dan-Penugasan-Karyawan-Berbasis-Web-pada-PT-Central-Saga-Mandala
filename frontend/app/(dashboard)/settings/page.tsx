"use client";

import { useState } from "react";
import { Toast } from "@/components/ui/Toast";
import {
  Settings as SettingsIcon,
  Database,
  Download,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Bell,
  ShieldCheck,
  RefreshCw,
  Mail,
  Lock,
  FileText,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "notification" | "backup" | "security">("general");
  const [appName, setAppName] = useState("Performa.id - Central Saga");
  const [timezone, setTimezone] = useState("Asia/Jakarta (WIB - UTC+7)");
  const [serverEmail, setServerEmail] = useState("admin@centralsaga.com");

  // Notification tab state
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [overdueAlertDays, setOverdueAlertDays] = useState(3);

  // Security tab state
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(120);
  const [mfaRequired, setMfaRequired] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string | null;
  }>({
    type: "success",
    message: null,
  });

  const [configError, setConfigError] = useState<string | null>(null);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverEmail.includes("@") || !serverEmail.includes(".")) {
      setConfigError("Gagal menyimpan konfigurasi: Format email notifikasi server tidak valid!");
      return;
    }
    setConfigError(null);
    setToast({
      type: "success",
      message: "Pengaturan umum & konfigurasi server Central Saga berhasil disimpan!",
    });
  };

  const handleRunBackup = () => {
    // Generate a downloadable PostgreSQL SQL file string
    const sqlContent = `-- PERFORMA.ID CENTRAL SAGA ENTERPRISE DATABASE BACKUP DUMP
-- Dump Date: 19 August 2026 16:30:00 WIB
-- Server Version: PostgreSQL 16.2

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL
);

INSERT INTO users (id, name, email, role) VALUES
(1, 'Admin System', 'admin@gmail.com', 'ADMIN'),
(2, 'Manager Utama', 'manager@gmail.com', 'MANAGER'),
(3, 'Sarah Jenkins', 'sarah@gmail.com', 'EMPLOYEE');
`;

    const blob = new Blob([sqlContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `performa_central_saga_backup_${Date.now()}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToast({
      type: "success",
      message: "Backup database PostgreSQL Central Saga (.sql) berhasil dibuat & diunduh!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Popup */}
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, message: null })}
      />

      {/* Error Alert Banner */}
      {configError && (
        <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="text-xs font-bold">{configError}</span>
          </div>
          <button
            onClick={() => setConfigError(null)}
            className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Pengaturan Sistem & Konfigurasi Central Saga</span>
          <SettingsIcon className="w-6 h-6 text-blue-600 inline-block" />
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Kelola parameter aplikasi, notifikasi server, dan backup database PostgreSQL.
        </p>
      </div>

      {/* Tab Navigation (Sleek Segmented Floating Control Pill) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-2xs text-xs font-bold">
        {[
          { id: "general", label: "General Settings", icon: Globe },
          { id: "notification", label: "Notification Engine", icon: Bell },
          { id: "backup", label: "Database Backup", icon: Database },
          { id: "security", label: "Security & Audit Logs", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-blue-950 font-black shadow-2xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 font-semibold"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-blue-700" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Settings Content based on Active Tab */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Dynamic Form Content (Crisp 1px Border & Shadow) */}
        <div className="lg:col-span-2 bg-white border border-slate-300 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 space-y-6">
          {activeTab === "general" && (
            <>
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center justify-between">
                <span>Informasi Dasar Aplikasi & Server Utama</span>
                <Globe className="w-5 h-5 text-blue-600" />
              </h3>

              <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">
                    Nama Platform Aplikasi
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">
                    Email Notifikasi Server (SMTP)
                  </label>
                  <input
                    type="text"
                    value={serverEmail}
                    onChange={(e) => setServerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">
                    Timezone Default
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs cursor-pointer"
                  >
                    <option value="Asia/Jakarta (WIB - UTC+7)">Asia/Jakarta (WIB - UTC+7)</option>
                    <option value="Asia/Makassar (WITA - UTC+8)">Asia/Makassar (WITA - UTC+8)</option>
                    <option value="Asia/Jayapura (WIT - UTC+9)">Asia/Jayapura (WIT - UTC+9)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer border border-blue-950"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === "notification" && (
            <>
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center justify-between">
                <span>Mesin Notifikasi & Pengingat Overdue</span>
                <Bell className="w-5 h-5 text-blue-600" />
              </h3>

              <div className="space-y-4 text-xs font-medium">
                <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl flex items-center justify-between shadow-2xs">
                  <div>
                    <p className="font-extrabold text-slate-900">Email Alerts Otomatis</p>
                    <p className="text-[11px] text-slate-500 font-medium">Kirim email pemberitahuan tugas baru & deadline</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlertsEnabled}
                    onChange={(e) => setEmailAlertsEnabled(e.target.checked)}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">
                    Batas Pengingat Overdue (Hari Sebelum Deadline)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={overdueAlertDays}
                    onChange={(e) => setOverdueAlertDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() =>
                      setToast({
                        type: "success",
                        message: "Pengaturan notifikasi email & overdue berhasil disimpan!",
                      })
                    }
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer border border-blue-950"
                  >
                    Simpan Notifikasi
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "backup" && (
            <>
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center justify-between">
                <span>Manajemen Cadangan Database (PostgreSQL)</span>
                <Database className="w-5 h-5 text-blue-600" />
              </h3>

              <div className="space-y-4 text-xs font-medium">
                <div className="p-4 bg-blue-50/80 border border-blue-300 rounded-2xl flex items-center justify-between shadow-2xs">
                  <div>
                    <p className="font-extrabold text-blue-950">Auto-Backup Terjadwal</p>
                    <p className="text-[11px] text-blue-800 font-semibold">Backup otomatis berjalan setiap hari pukul 02:00 WIB</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-full text-[11px] border border-emerald-300 shadow-2xs">
                    Aktif
                  </span>
                </div>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    onClick={handleRunBackup}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold shadow-md cursor-pointer border border-blue-950"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Dump Database (.sql)</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "security" && (
            <>
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center justify-between">
                <span>Keamanan & Kebijakan Sesi Spatie RBAC</span>
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </h3>

              <div className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">
                    Batas Inaktivitas Sesi Sesi Login (Menit)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={480}
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                  />
                </div>

                <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl flex items-center justify-between shadow-2xs">
                  <div>
                    <p className="font-extrabold text-slate-900">Wajibkan Two-Factor Authentication (MFA)</p>
                    <p className="text-[11px] text-slate-500 font-medium">Berlaku untuk role Administrator & Manager</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={mfaRequired}
                    onChange={(e) => setMfaRequired(e.target.checked)}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() =>
                      setToast({
                        type: "success",
                        message: "Kebijakan keamanan & sesi Spatie RBAC berhasil disimpan!",
                      })
                    }
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer border border-blue-950"
                  >
                    Simpan Keamanan
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right 1 Col: Database Backup Download Box (Crisp 1px Border & Shadow) */}
        <div className="bg-white border border-slate-300 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 space-y-5 h-fit">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200 shadow-2xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Database Backup
              </h3>
              <p className="text-[11px] text-slate-400 font-bold">PostgreSQL 16 Dump</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 font-bold">
              <span>Status Backup:</span>
              <span className="font-black text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Normal
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-semibold">
              Terakhir di-backup: <span className="font-extrabold text-slate-800">19 Agustus 2026, 02:00 WIB</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={handleRunBackup}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-300 shadow-2xs"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Download Backup (.sql)</span>
            </button>

            <button
              onClick={handleRunBackup}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer border border-blue-950"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Jalankan Backup Manual</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
