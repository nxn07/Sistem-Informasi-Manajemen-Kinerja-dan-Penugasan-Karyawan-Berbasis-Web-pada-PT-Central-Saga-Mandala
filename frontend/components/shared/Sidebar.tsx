"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Building2,
  Target,
  Award,
  Users,
  History,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { authService } from "@/services/auth-service";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { name: "Manajemen Tugas", href: "/tasks", icon: CheckSquare, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { name: "Evaluasi Kinerja", href: "/evaluations", icon: Award, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { name: "Master Divisi", href: "/divisions", icon: Building2, roles: ["ADMIN"] },
  { name: "Kriteria KPI", href: "/kpis", icon: Target, roles: ["ADMIN"] },
  { name: "Manajemen User", href: "/users", icon: Users, roles: ["ADMIN"] },
  { name: "Audit Log", href: "/activity-logs", icon: History, roles: ["ADMIN"] },
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
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shrink-0 border border-emerald-500/30">
            <img src="/central-saga-logo.png" alt="Central Saga" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white leading-tight">
              Central Saga
            </h1>
            <p className="text-[10px] font-bold text-emerald-400 tracking-wide uppercase">
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
              return item.roles.some((r) => userRoles.includes(r.toUpperCase()));
            })
            .map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm font-bold"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
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
            {user?.name?.slice(0, 2).toUpperCase() || "AS"}
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
