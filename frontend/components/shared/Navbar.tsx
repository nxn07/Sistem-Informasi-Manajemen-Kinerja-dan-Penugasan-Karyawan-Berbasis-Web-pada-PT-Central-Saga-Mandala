"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { User } from "@/types/api";
import { Shield, Briefcase, UserCheck, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Dashboard Overview";
      case "/tasks":
        return "Manajemen Penugasan";
      case "/evaluations":
        return "Evaluasi Kinerja";
      case "/divisions":
        return "Master Divisi";
      case "/kpis":
        return "Kriteria KPI";
      case "/users":
        return "Manajemen User & RBAC";
      case "/activity-logs":
        return "Audit Log Aktivitas";
      case "/settings":
        return "Pengaturan Sistem";
      default:
        return "Dashboard Kinerja";
    }
  };

  const getRoleBadge = (roleName?: string) => {
    const r = roleName?.toUpperCase() || "ADMIN";
    if (r === "ADMIN") {
      return (
        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1">
          <Shield className="w-3 h-3 text-rose-600" /> ADMIN
        </span>
      );
    } else if (r === "MANAGER") {
      return (
        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
          <Briefcase className="w-3 h-3 text-blue-600" /> MANAGER
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
          <UserCheck className="w-3 h-3 text-emerald-600" /> EMPLOYEE
        </span>
      );
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-2xs">
      {/* Dynamic Title based on Active Route */}
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        <span className="text-slate-900 font-black text-sm capitalize tracking-normal">
          {getPageTitle(pathname)}
        </span>
        <span className="text-slate-300">•</span>
        <span className="text-emerald-600 font-extrabold">Central Saga</span>
      </div>

      {/* Right Header Controls: User Profile & Logout */}
      <div className="flex items-center gap-4">
        {/* User Info & Logout Button Pill Card with Elegant Shadow */}
        <div className="flex items-center gap-3 bg-white p-1.5 pl-3.5 pr-2 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-800 text-white font-extrabold flex items-center justify-center text-xs shadow-2xs">
            {user?.name?.slice(0, 2).toUpperCase() || "CS"}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <p className="text-xs font-bold text-slate-900">{user?.name || "Admin System"}</p>
              {getRoleBadge(user?.role)}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{user?.email || "admin@gmail.com"}</p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-bold"
            title="Keluar / Ke Halaman Login"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
