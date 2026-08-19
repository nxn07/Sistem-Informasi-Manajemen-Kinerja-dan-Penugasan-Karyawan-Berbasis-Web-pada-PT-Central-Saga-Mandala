"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CheckSquare, 
  Building2, 
  Target, 
  Award, 
  Users, 
  ShieldCheck, 
  History, 
  LogOut 
} from "lucide-react";
import { authService } from "@/services/auth-service";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Tugas (Tasks)", href: "/tasks", icon: CheckSquare, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { name: "Divisi", href: "/divisions", icon: Building2, roles: ["ADMIN", "MANAGER"] },
  { name: "Kriteria KPI", href: "/kpis", icon: Target, roles: ["ADMIN", "MANAGER"] },
  { name: "Evaluasi Kinerja", href: "/evaluations", icon: Award, roles: ["ADMIN", "MANAGER"] },
  { name: "Manajemen User", href: "/users", icon: Users, roles: ["ADMIN"] },
  { name: "Audit Log", href: "/activity-logs", icon: History, roles: ["ADMIN"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-between p-4 flex-shrink-0">
      <div>
        <div className="px-3 py-4 mb-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">SIM-KAP</h1>
          <p className="text-xs text-slate-400">Sistem Informasi Kinerja</p>
        </div>

        <nav className="space-y-1">
          {menuItems
            .filter((item) => {
              if (!item.roles) return true;
              const userRoles = user?.roles || (user?.role ? [user.role] : ["ADMIN", "MANAGER", "EMPLOYEE"]);
              return item.roles.some((r) => userRoles.includes(r));
            })
            .map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={() => authService.logout()}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
