"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user-service";
import { auditLogService } from "@/services/audit-log-service";
import { Toast } from "@/components/ui/Toast";
import Cookies from "js-cookie";
import {
  Settings as SettingsIcon,
  Database,
  Download,
  CheckCircle2,
  AlertTriangle,
  Globe,
  User as UserIcon,
  Camera,
  Phone,
  MapPin,
  Briefcase,
  Mail,
  BadgeCheck,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const userRole = (user?.role || user?.roles?.[0] || "EMPLOYEE").toUpperCase();
  const isEmployee = userRole === "EMPLOYEE";

  const [activeTab, setActiveTab] = useState<"profile" | "general" | "backup">("profile");

  // Profile Edit State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // General Settings tab state (Admin & Manager only)
  const [appName, setAppName] = useState("Central Saga — SIM-KAP Enterprise");
  const [timezone, setTimezone] = useState("Asia/Jakarta (WIB - UTC+7)");
  const [serverEmail, setServerEmail] = useState("admin@centralsaga.com");

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string | null;
  }>({
    type: "success",
    message: null,
  });

  const [configError, setConfigError] = useState<string | null>(null);

  // Initialize Profile form with current user data
  useEffect(() => {
    if (user) {
      const cleanEmail = user.email ? user.email.trim().toLowerCase() : "";
      setFullName(user.name || "");
      setEmail(user.email || "");
      
      // Load stored custom profile details
      if (typeof window !== "undefined" && cleanEmail) {
        const savedPhone = localStorage.getItem(`simkap_user_phone_${cleanEmail}`);
        const savedPos = localStorage.getItem(`simkap_user_pos_${cleanEmail}`);
        const savedAddr = localStorage.getItem(`simkap_user_addr_${cleanEmail}`);
        const savedAvatar = localStorage.getItem(`simkap_user_avatar_${cleanEmail}`);

        setPhone(savedPhone || "+62 812-3456-7890");
        setPosition(savedPos || (user.role === "ADMIN" ? "Super Admin Systems" : user.role === "MANAGER" ? "Senior Operations Manager" : "Finance Specialist"));
        setAddress(savedAddr || "Jl. Jenderal Sudirman No. 45, Jakarta Selatan");
        if (savedAvatar) setAvatarUrl(savedAvatar);
      }
    }
  }, [user]);

  // Handle Photo Upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setToast({
          type: "error",
          message: "Ukuran foto terlalu besar. Maksimal 3MB!",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarUrl(result);
        if (typeof window !== "undefined" && user?.email) {
          const cleanEmail = user.email.trim().toLowerCase();
          localStorage.setItem(`simkap_user_avatar_${cleanEmail}`, result);
          window.dispatchEvent(new Event("simkap_user_updated"));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Profile Form Submit
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const cleanEmail = user.email ? user.email.trim().toLowerCase() : "";

      // 1. Persist to localStorage for user profile attributes
      if (typeof window !== "undefined" && cleanEmail) {
        localStorage.setItem(`simkap_user_phone_${cleanEmail}`, phone);
        localStorage.setItem(`simkap_user_pos_${cleanEmail}`, position);
        localStorage.setItem(`simkap_user_addr_${cleanEmail}`, address);
        if (avatarUrl) {
          localStorage.setItem(`simkap_user_avatar_${cleanEmail}`, avatarUrl);
        }
      }

      // 2. Update user name in auth session and localStorage/Cookies
      const updatedUser = {
        ...user,
        name: fullName,
      };

      Cookies.set("simkap_user", JSON.stringify(updatedUser), { expires: 7 });
      if (typeof window !== "undefined") {
        localStorage.setItem("simkap_user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("simkap_user_updated"));
      }

      // 3. Update in userService map
      await userService.update(user.id, { name: fullName });

      // 4. Log Audit Activity
      auditLogService.logActivity(
        user.name,
        "PROFILE_UPDATED",
        "App\\Models\\User",
        `Pengguna '${fullName}' (${user.role || "EMPLOYEE"}) memperbarui informasi profil pribadi & foto avatar`
      );

      setToast({
        type: "success",
        message: `Profil pengguna '${fullName}' berhasil diperbarui!`,
      });
    } catch {
      setToast({
        type: "error",
        message: "Gagal menyimpan perubahan profil.",
      });
    }
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverEmail.includes("@") || !serverEmail.includes(".")) {
      setConfigError("Gagal menyimpan konfigurasi: Format email notifikasi server tidak valid!");
      return;
    }
    setConfigError(null);
    auditLogService.logActivity(
      user?.name,
      "SETTINGS_UPDATED",
      "App\\Models\\SystemConfig",
      `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) memperbarui konfigurasi umum & server email`
    );
    setToast({
      type: "success",
      message: "Pengaturan umum & konfigurasi server Central Saga berhasil disimpan!",
    });
  };

  const handleRunBackup = () => {
    const sqlContent = `-- PERFORMA.ID CENTRAL SAGA ENTERPRISE DATABASE BACKUP DUMP
-- Dump Date: ${new Date().toLocaleString("id-ID")}
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
    link.download = `central_saga_backup_${Date.now()}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    auditLogService.logActivity(
      user?.name,
      "DATABASE_BACKUP",
      "App\\Models\\Database",
      `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) mendownload dump cadangan database PostgreSQL`
    );

    setToast({
      type: "success",
      message: "Backup database PostgreSQL Central Saga (.sql) berhasil dibuat & diunduh!",
    });
  };

  // Define tab navigation based on Role:
  // Employee only gets 'profile'
  // Admin & Manager get 'profile', 'general', and 'backup'
  const availableTabs = isEmployee
    ? [{ id: "profile", label: "Profil Saya", icon: UserIcon }]
    : [
        { id: "profile", label: "Profil Saya", icon: UserIcon },
        { id: "general", label: "General Settings", icon: Globe },
        { id: "backup", label: "Database Backup", icon: Database },
      ];

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
          <span>Pengaturan Akun & Profil Central Saga</span>
          <SettingsIcon className="w-6 h-6 text-blue-600 inline-block" />
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          {isEmployee
            ? "Kelola informasi profil pribadi dan foto avatar akun Anda."
            : "Kelola informasi profil pribadi, foto avatar, parameter aplikasi, dan backup database PostgreSQL."}
        </p>
      </div>

      {/* Tab Navigation (Rendered according to Role) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-2xs text-xs font-bold">
        {availableTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white font-extrabold shadow-md border border-slate-900 scale-102"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 font-semibold"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Tab Form Container */}
        <div className="lg:col-span-2 bg-white border border-slate-300 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 space-y-6">
          {/* TAB 1: PROFIL SAYA (All Roles) */}
          {activeTab === "profile" && (
            <>
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center justify-between">
                <span>Edit Informasi Profil Pribadi</span>
                <UserIcon className="w-5 h-5 text-blue-600" />
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-5 text-xs font-medium">
                {/* Photo Avatar Upload & Preview Box */}
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center gap-5 shadow-2xs">
                  <div className="relative group shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-blue-900 text-white font-black flex items-center justify-center text-xl overflow-hidden border-2 border-blue-400/40 shadow-md">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        fullName.slice(0, 2).toUpperCase() || "CS"
                      )}
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute -bottom-2 -right-2 p-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-md cursor-pointer transition-transform hover:scale-110 border border-white"
                      title="Ganti Foto Profil"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-xs">Foto Profile Avatar</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Unggah foto profil dalam format JPG atau PNG. Ukuran berkas maksimal 3MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-extrabold text-slate-800 mb-1.5">
                      Nama Lengkap:
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-800 mb-1.5">
                      Email Login Akun (Read-only):
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        disabled
                        value={email}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-500 cursor-not-allowed shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-extrabold text-slate-800 mb-1.5">
                      Jabatan / Position:
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="Contoh: Senior Finance Specialist"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-800 mb-1.5">
                      Nomor Telepon / WhatsApp:
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+62 812-3456-7890"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1.5">
                    Alamat Domisili / Kantor:
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Masukkan alamat lengkap..."
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-900 hover:bg-blue-950 active:scale-98 text-white rounded-xl font-extrabold transition-all shadow-md cursor-pointer border border-blue-950"
                  >
                    Simpan Perubahan Profil
                  </button>
                </div>
              </form>
            </>
          )}

          {/* TAB 2: GENERAL SETTINGS (Admin & Manager Only) */}
          {!isEmployee && activeTab === "general" && (
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
                    className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 active:scale-98 text-white rounded-xl font-extrabold transition-all shadow-md cursor-pointer border border-slate-900"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </>
          )}

          {/* TAB 3: DATABASE BACKUP (Admin & Manager Only) */}
          {!isEmployee && activeTab === "backup" && (
            <>
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center justify-between">
                <span>Pencadangan Database PostgreSQL</span>
                <Database className="w-5 h-5 text-blue-600" />
              </h3>

              <div className="space-y-4 text-xs font-medium">
                <p className="text-slate-600">
                  Unduh dump SQL cadangan database secara manual untuk arsip sistem dan pemulihan bencana (*Disaster Recovery*).
                </p>

                <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Database Driver:</span>
                    <span className="font-extrabold text-slate-900">PostgreSQL 16.2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Ukuran Dump Est:</span>
                    <span className="font-extrabold text-slate-900">4.2 MB</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleRunBackup}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-extrabold transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-blue-300" />
                    <span>Download PostgreSQL Dump (.sql)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right 1 Col: Live Executive User ID Card Preview & Database Backup Box */}
        <div className="space-y-6">
          {/* Live User Identity Preview Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                Live Identity Card
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                🟢 Akun Aktif
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white font-black flex items-center justify-center text-lg shadow-md border-2 border-blue-400/40 shrink-0 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  fullName.slice(0, 2).toUpperCase() || "CS"
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-slate-900 text-base truncate">{fullName || "User Central Saga"}</h4>
                <p className="text-xs font-bold text-blue-700 truncate mt-0.5">{position || "Staff Specialist"}</p>
                <div className="mt-1">
                  <span
                    className={`px-2 py-0.5 text-[9.5px] font-black rounded-full border ${
                      userRole === "ADMIN"
                        ? "bg-rose-100 text-rose-800 border-rose-300"
                        : userRole === "MANAGER"
                        ? "bg-blue-100 text-blue-800 border-blue-300"
                        : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    {userRole}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs space-y-2 font-medium">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> Email:
                </span>
                <span className="font-extrabold text-slate-800 truncate max-w-[140px] text-[11px]">{email}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> Telepon:
                </span>
                <span className="font-extrabold text-slate-800 text-[11px]">{phone}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> Domisili:
                </span>
                <span className="font-extrabold text-slate-800 truncate max-w-[140px] text-[11px]">{address}</span>
              </div>
            </div>
          </div>

          {/* Database Backup Download Box (Admin & Manager Only) */}
          {!isEmployee && (
            <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 space-y-5 relative overflow-hidden group">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Database Backup
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold">PostgreSQL 16 Dump</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2 text-xs shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 font-bold">
                  <span>Status Backup:</span>
                  <span className="font-black text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Normal
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={handleRunBackup}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-extrabold transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-300" />
                  <span>Download Backup (.sql)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
