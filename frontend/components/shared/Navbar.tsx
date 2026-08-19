"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { User } from "@/types/api";
import Cookies from "js-cookie";
import { UserCircle, Shield, Briefcase, UserCheck, LogOut, RefreshCw } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const switchRoleDemo = (roleType: "ADMIN" | "MANAGER" | "EMPLOYEE") => {
    let mockUser: User = {
      id: 1,
      name: "Admin System",
      email: "admin@gmail.com",
      role: "ADMIN",
      roles: ["ADMIN"],
      permissions: ["*"],
      created_at: "2026-08-19",
    };

    if (roleType === "MANAGER") {
      mockUser = {
        id: 2,
        name: "Manager Utama",
        email: "manager@gmail.com",
        role: "MANAGER",
        roles: ["MANAGER"],
        permissions: ["tasks.create", "tasks.review", "evaluations.create"],
        created_at: "2026-08-19",
      };
    } else if (roleType === "EMPLOYEE") {
      mockUser = {
        id: 3,
        name: "Sarah Jenkins",
        email: "sarah@gmail.com",
        role: "EMPLOYEE",
        roles: ["EMPLOYEE"],
        permissions: ["tasks.submit", "evaluations.view_own"],
        created_at: "2026-08-19",
      };
    }

    const mockToken = `demo_token_${mockUser.role}_${Date.now()}`;
    Cookies.set("simkap_token", mockToken, { expires: 7 });
    Cookies.set("simkap_user", JSON.stringify(mockUser), { expires: 7 });
    setUser(mockUser);
    window.location.reload();
  };

  const handleLogout = () => {
    authService.logout();
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
        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1">
          <UserCheck className="w-3 h-3 text-slate-600" /> EMPLOYEE
        </span>
      );
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-2xs">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        Dashboard Kinerja Karyawan — <span className="text-blue-600 font-extrabold">Central Saga</span>
      </div>

      {/* Right Header Controls: Role Switcher & User Profile */}
      <div className="flex items-center gap-4">
        {/* Quick Role Switcher Bar */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-[11px] font-bold">
          <span className="text-[10px] text-slate-400 px-2 uppercase tracking-wider">Role Active:</span>
          <button
            onClick={() => switchRoleDemo("ADMIN")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              user?.role?.toUpperCase() === "ADMIN"
                ? "bg-rose-600 text-white shadow-2xs font-extrabold"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            ADMIN
          </button>
          <button
            onClick={() => switchRoleDemo("MANAGER")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              user?.role?.toUpperCase() === "MANAGER"
                ? "bg-blue-600 text-white shadow-2xs font-extrabold"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            MANAGER
          </button>
          <button
            onClick={() => switchRoleDemo("EMPLOYEE")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              user?.role?.toUpperCase() === "EMPLOYEE"
                ? "bg-slate-800 text-white shadow-2xs font-extrabold"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            EMPLOYEE
          </button>
        </div>

        {/* User Info & Logout Button */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-extrabold flex items-center justify-center text-xs shadow-2xs">
            {user?.name?.slice(0, 2).toUpperCase() || "AS"}
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
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="Keluar / Ke Halaman Login"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
