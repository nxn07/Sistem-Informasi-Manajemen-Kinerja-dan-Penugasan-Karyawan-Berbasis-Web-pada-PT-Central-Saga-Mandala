"use client";

import { useState } from "react";
import { UserCheck, Shield, Mail, Search, Plus } from "lucide-react";

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  position: string;
}

const mockUsers: UserItem[] = [
  {
    id: 1,
    name: "Admin System",
    email: "admin@gmail.com",
    role: "ADMIN",
    position: "System Administrator",
  },
  {
    id: 2,
    name: "Manager Utama",
    email: "manager@gmail.com",
    role: "MANAGER",
    position: "Head of IT Division",
  },
  {
    id: 3,
    name: "Haskell Tromp II",
    email: "haskell@gmail.com",
    role: "EMPLOYEE",
    position: "Backend Developer",
  },
  {
    id: 4,
    name: "Natalie McDermott",
    email: "natalie@gmail.com",
    role: "EMPLOYEE",
    position: "UI/UX Designer",
  },
  {
    id: 5,
    name: "Van Larkin",
    email: "van@gmail.com",
    role: "EMPLOYEE",
    position: "QA Engineer",
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.position.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (role: UserItem["role"]) => {
    const badges: Record<UserItem["role"], string> = {
      ADMIN: "bg-rose-50 text-rose-700 border-rose-200",
      MANAGER: "bg-blue-50 text-blue-700 border-blue-200",
      EMPLOYEE: "bg-slate-100 text-slate-700 border-slate-200",
    };

    return (
      <span
        className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${badges[role]}`}
      >
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Pengguna & Hak Akses
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pengelolaan akun pengguna, peran (Roles), dan izin akses Spatie RBAC
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer shrink-0">
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama, email, atau jabatan..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Pengguna</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Jabatan</th>
                <th className="py-3.5 px-4 text-center">Role Akses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{user.name}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {user.email}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500">{user.position}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      {getRoleBadge(user.role)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
