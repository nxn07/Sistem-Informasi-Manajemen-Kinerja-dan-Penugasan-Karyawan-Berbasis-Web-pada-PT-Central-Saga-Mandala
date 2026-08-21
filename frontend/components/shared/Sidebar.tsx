"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth-service";
import centralSagaLogo from "@/public/central-saga-logo.png";
import {
  LayoutDashboard,
  CheckSquare,
  Award,
  Building2,
  Target,
  Users,
  History,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { name: "Manajemen Tugas", href: "/tasks", icon: CheckSquare, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { name: "Evaluasi Kinerja", href: "/evaluations", icon: Award, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { name: "Master Divisi", href: "/divisions", icon: Building2, roles: ["ADMIN"], permission: "divisions.manage" },
  { name: "Kriteria KPI", href: "/kpis", icon: Target, roles: ["ADMIN"], permission: "kpis.manage" },
  { name: "Manajemen User", href: "/users", icon: Users, roles: ["ADMIN", "MANAGER"], permission: "users.delete" },
  { name: "Audit Log", href: "/activity-logs", icon: History, roles: ["ADMIN"], permission: "logs.view" },
  { name: "Pengaturan", href: "/settings", icon: Settings, roles: ["ADMIN"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-between p-4 shrink-0 border-r border-slate-800">
      <div>
        {/* Brand Header with Official Central Saga Green Logo & Name */}
        <div className="px-3 py-4 mb-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-lg shadow-emerald-500/10 shrink-0 border-2 border-emerald-500/40 ring-2 ring-emerald-500/20">
            <Image src={centralSagaLogo} alt="Central Saga" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white leading-tight">
              Central Saga
            </h1>
            <p className="text-[10px] font-extrabold text-emerald-400 tracking-wide uppercase">
              Enterprise Performance
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems
            .filter((item) => {
              if (!item.roles) return true;

              const extractRoleName = (r: any): string => {
                if (!r) return "";
                if (typeof r === "string") return r.toUpperCase();
                if (typeof r === "object" && r.name) return String(r.name).toUpperCase();
                return String(r).toUpperCase();
              };

              const getRawRoles = () => {
                if (Array.isArray(user?.roles) && user.roles.length > 0) return user.roles;
                if (user?.role) return [user.role];
                return ["ADMIN", "MANAGER", "EMPLOYEE"];
              };

              const userRoles = getRawRoles().map(extractRoleName);
              const hasRoleMatch = item.roles.some((r) => userRoles.includes(r.toUpperCase()));

              const userPerms = user?.permissions || [];
              const hasPermMatch = item.permission
                ? userPerms.includes(item.permission) || userPerms.includes("*")
                : false;

              return hasRoleMatch || hasPermMatch;
            })
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
        </nav>
      </div>

      {/* User Footer & Logout */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700/60 shadow-xs flex items-center gap-2 text-xs">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
            {user?.name?.slice(0, 2).toUpperCase() || "CS"}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="font-bold text-slate-200 truncate text-[11px]">
              {user?.name || "Admin System"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {user?.email || "admin@gmail.com"}
            </p>
          </div>
        </div>

        <button
          onClick={() => authService.logout()}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-98"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
