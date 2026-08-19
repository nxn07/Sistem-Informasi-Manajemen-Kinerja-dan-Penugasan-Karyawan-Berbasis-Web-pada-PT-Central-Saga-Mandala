"use client";

import { useState } from "react";
import { Toast } from "@/components/ui/Toast";
import {
  Users as UsersIcon,
  Plus,
  Search,
  Filter,
  Shield,
  Key,
  CheckCircle2,
  AlertOctagon,
  X,
  Lock,
  UserCheck,
} from "lucide-react";

interface UserItem {
  id: number;
  name: string;
  email: string;
  position: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  permissions: string[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: 1,
      name: "Admin System",
      email: "admin@gmail.com",
      position: "System Administrator",
      role: "ADMIN",
      permissions: ["tasks.create", "tasks.submit", "tasks.review", "users.manage"],
    },
    {
      id: 2,
      name: "Manager Utama",
      email: "manager@gmail.com",
      position: "Head of IT Division",
      role: "MANAGER",
      permissions: ["tasks.create", "tasks.review", "evaluations.create"],
    },
    {
      id: 3,
      name: "Sarah Jenkins",
      email: "sarah@gmail.com",
      position: "Finance Specialist",
      role: "EMPLOYEE",
      permissions: ["tasks.submit", "evaluations.view_own"],
    },
    {
      id: 4,
      name: "Michael Ross",
      email: "michael@gmail.com",
      position: "IT Operations",
      role: "EMPLOYEE",
      permissions: ["tasks.submit", "evaluations.view_own"],
    },
    {
      id: 5,
      name: "Natalie McDermott",
      email: "natalie@gmail.com",
      position: "UI/UX Designer",
      role: "EMPLOYEE",
      permissions: ["tasks.submit", "evaluations.view_own"],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");

  // Selected User for RBAC Permission Modal
  const [selectedUserForRbac, setSelectedUserForRbac] = useState<UserItem | null>(null);
  const [editedRole, setEditedRole] = useState<"ADMIN" | "MANAGER" | "EMPLOYEE">("EMPLOYEE");
  const [editedPermissions, setEditedPermissions] = useState<string[]>([]);

  // Toast & Error States
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string | null;
  }>({
    type: "success",
    message: null,
  });

  const [hasPermissionError, setHasPermissionError] = useState(false);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRoleFilter === "ALL" || u.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  const openRbacModal = (userItem: UserItem) => {
    setSelectedUserForRbac(userItem);
    setEditedRole(userItem.role);
    setEditedPermissions(userItem.permissions);
  };

  const handleTogglePermission = (permissionKey: string) => {
    setEditedPermissions((prev) =>
      prev.includes(permissionKey)
        ? prev.filter((p) => p !== permissionKey)
        : [...prev, permissionKey]
    );
  };

  const handleSaveRbac = () => {
    if (!selectedUserForRbac) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUserForRbac.id
          ? { ...u, role: editedRole, permissions: editedPermissions }
          : u
      )
    );

    setSelectedUserForRbac(null);
    setToast({
      type: "success",
      message: `Peran pengguna (${editedRole}) & Hak Akses Spatie RBAC berhasil disimpan oleh Administrator Central Saga!`,
    });
  };

  const getRoleBadge = (role: UserItem["role"]) => {
    if (role === "ADMIN") {
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-rose-100 text-rose-800 border border-rose-200">
          ADMIN
        </span>
      );
    } else if (role === "MANAGER") {
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          MANAGER
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          EMPLOYEE
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Popup */}
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, message: null })}
      />

      {/* Access Denied (403) Banner Warning */}
      {hasPermissionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="text-xs font-bold">
              Akses Ditolak: Anda tidak memiliki permission &apos;users.manage&apos; (403 Forbidden)!
            </span>
          </div>
          <button
            onClick={() => setHasPermissionError(false)}
            className="p-1 hover:bg-rose-100 rounded-lg text-rose-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Pengguna & Hak Akses Central Saga
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan akun pengguna, peran (Roles), dan izin akses Spatie RBAC.
          </p>
        </div>

        <button
          onClick={() =>
            setToast({
              type: "success",
              message: "Form pendaftaran pegawai baru dibuka!",
            })
          }
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Toolbar Search & Role Filter */}
      <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, atau jabatan pegawai..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white font-semibold text-slate-700"
            >
              <option value="ALL">Semua Role</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Showing {filteredUsers.length} users
          </span>
        </div>
      </div>

      {/* Data Table View */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">PENGGUNA</th>
                <th className="py-3.5 px-4">EMAIL</th>
                <th className="py-3.5 px-4">JABATAN</th>
                <th className="py-3.5 px-4">ROLE AKSES SPATIE</th>
                <th className="py-3.5 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{u.email}</td>
                  <td className="py-4 px-4 text-slate-800 font-semibold">{u.position}</td>
                  <td className="py-4 px-4">{getRoleBadge(u.role)}</td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => openRbacModal(u)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Edit Role Spatie</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup: Edit Hak Akses Spatie RBAC */}
      {selectedUserForRbac && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Edit Hak Akses Spatie RBAC
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pengguna: {selectedUserForRbac.name} ({selectedUserForRbac.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForRbac(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pilih Role Utama:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["ADMIN", "MANAGER", "EMPLOYEE"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setEditedRole(r)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      editedRole === r
                        ? "bg-blue-900 text-white border-blue-900 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Permissions Checkbox Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Izin Akses Spesifik (Permissions):
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: "tasks.create", label: "tasks.create (Buat Tugas)" },
                  { key: "tasks.submit", label: "tasks.submit (Submit Bukti)" },
                  { key: "tasks.review", label: "tasks.review (Review Atasan)" },
                  { key: "users.manage", label: "users.manage (Kelola User)" },
                  { key: "evaluations.create", label: "evaluations.create" },
                  { key: "divisions.manage", label: "divisions.manage" },
                ].map((perm) => {
                  const isChecked = editedPermissions.includes(perm.key);
                  return (
                    <div
                      key={perm.key}
                      onClick={() => handleTogglePermission(perm.key)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? "bg-blue-50/80 border-blue-300 text-blue-900 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span>{perm.label}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-white text-[10px] ${
                          isChecked ? "bg-blue-600" : "border border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && "✓"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedUserForRbac(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveRbac}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl transition-colors shadow-md cursor-pointer"
              >
                Simpan Hak Akses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
