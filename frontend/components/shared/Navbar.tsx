"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth-service";
import { User } from "@/types/api";
import { UserCircle } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="text-sm font-medium text-slate-600">
        Dashboard Kinerja Karyawan
      </div>

      <div className="flex items-center gap-3">
        <UserCircle className="w-8 h-8 text-slate-400" />
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">{user?.name || "User"}</p>
          <p className="text-xs text-slate-500">{user?.email || "-"}</p>
        </div>
      </div>
    </header>
  );
}
