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
  { name: "Master Divisi", href: "/divisions", icon: Building2, roles: ["ADMIN", "MANAGER"] },
  { name: "Kriteria KPI", href: "/kpis", icon: Target, roles: ["ADMIN", "MANAGER"] },
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
        {/* Brand Header with Central Saga Branding */}
        <div className="px-3 py-4 mb-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
            <Sparkles className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
              Performa.id
            </h1>
            <p className="text-[10px] font-semibold text-blue-400 tracking-wide uppercase">
              Central Saga Ent.
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
        <div className="px-3 py-2 bg-slate-800/60 rounded-xl flex items-center gap-2 text-xs">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
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
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
