"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/user-service";
import { User } from "@/types/api";
import { Toast } from "@/components/ui/Toast";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";
import { auditLogService } from "@/services/audit-log-service";
import {
  Search,
  Shield,
  Loader2,
  Check,
  X,
  UserPlus,
  Key,
  Users,
  Power,
  PowerOff,
  AlertTriangle,
} from "lucide-react";

const PERMISSIONS_BY_ROLE: Record<string, { key: string; label: string }[]> = {
  EMPLOYEE: [
    { key: "tasks.create", label: "tasks.create (Buat Tugas)" },
    { key: "tasks.submit", label: "tasks.submit (Submit Bukti)" },
    { key: "tasks.review", label: "tasks.review (Review Atasan)" },
  ],
  MANAGER: [
    { key: "tasks.create", label: "tasks.create (Buat Tugas)" },
    { key: "tasks.submit", label: "tasks.submit (Submit Bukti)" },
    { key: "tasks.review", label: "tasks.review (Review Atasan)" },
    { key: "evaluations.create", label: "evaluations.create (Evaluasi)" },
    { key: "users.delete", label: "users.delete (Kelola Status Karyawan)" },
  ],
  ADMIN: [
    { key: "tasks.create", label: "tasks.create (Buat Tugas)" },
    { key: "tasks.submit", label: "tasks.submit (Submit Bukti)" },
    { key: "tasks.review", label: "tasks.review (Review Atasan)" },
    { key: "users.manage", label: "users.manage (Kelola User)" },
    { key: "users.delete", label: "users.delete (Kelola Status Karyawan)" },
    { key: "evaluations.create", label: "evaluations.create (Evaluasi)" },
    { key: "divisions.manage", label: "divisions.manage (Divisi)" },
  ],
};

export default function UsersPage() {
  const { user } = useAuth();
  const rawRole = (user?.role || user?.roles?.[0] || "ADMIN").toUpperCase();
  const isAdmin = rawRole === "ADMIN";
  const userPerms = user?.permissions || [];
  const canManageUserStatus = isAdmin || userPerms.includes("users.delete") || userPerms.includes("*");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal Control States
  const [selectedUserForRbac, setSelectedUserForRbac] = useState<User | null>(null);
  const [editedRole, setEditedRole] = useState<string>("EMPLOYEE");
  const [editedPermissions, setEditedPermissions] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New User Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("EMPLOYEE");

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string | null;
  }>({
    type: "success",
    message: null,
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch {
      setToast({
        type: "error",
        message: "Gagal memuat daftar pengguna.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openRbacModal = (userItem: User) => {
    setSelectedUserForRbac(userItem);
    const userRole = (userItem.role || userItem.roles?.[0] || "EMPLOYEE").toUpperCase();
    setEditedRole(userRole);
    const cleanEmail = userItem.email.toLowerCase().trim();
    
    let currentPerms = userItem.permissions;
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(`simkap_user_perm_${cleanEmail}`);
        if (raw) currentPerms = JSON.parse(raw);
      } catch {
        // ignore
      }
    }

    if (userRole === "EMPLOYEE" && currentPerms) {
      currentPerms = currentPerms.filter((p) => ["tasks.create", "tasks.submit", "tasks.review"].includes(p));
    } else if (userRole === "MANAGER" && currentPerms) {
      currentPerms = currentPerms.filter((p) => ["tasks.create", "tasks.submit", "tasks.review", "evaluations.create", "users.delete"].includes(p));
    }

    setEditedPermissions(
      currentPerms && currentPerms.length > 0
        ? currentPerms
        : userRole === "ADMIN"
        ? ["*"]
        : userRole === "MANAGER"
        ? ["tasks.create", "tasks.submit", "tasks.review"]
        : ["tasks.submit"]
    );
  };

  const handleTogglePermission = (permKey: string) => {
    setEditedPermissions((prev) =>
      prev.includes(permKey)
        ? prev.filter((p) => p !== permKey)
        : [...prev, permKey]
    );
  };

  const handleRolePillClick = (targetRole: string) => {
    setEditedRole(targetRole);
    if (targetRole === "ADMIN") {
      setEditedPermissions(["*"]);
    } else if (targetRole === "MANAGER") {
      setEditedPermissions(["tasks.create", "tasks.submit", "tasks.review"]);
    } else {
      setEditedPermissions(["tasks.submit"]);
    }
  };

  const handleSaveRbac = async () => {
    if (!selectedUserForRbac) return;
    try {
      const cleanEmail = selectedUserForRbac.email.toLowerCase().trim();

      if (typeof window !== "undefined") {
        localStorage.setItem(`simkap_user_perm_${cleanEmail}`, JSON.stringify(editedPermissions));
      }

      const updated = await userService.update(selectedUserForRbac.id, {
        role: editedRole,
        roles: [editedRole],
        permissions: editedPermissions,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUserForRbac.id ? { ...updated, permissions: editedPermissions } : u))
      );

      const currentUserStr = Cookies.get("simkap_user") || (typeof window !== "undefined" ? localStorage.getItem("simkap_user") : null);
      if (currentUserStr) {
        try {
          const loggedInUser: User = JSON.parse(currentUserStr);
          if (loggedInUser.email?.toLowerCase().trim() === cleanEmail) {
            const newSessionUser = {
              ...loggedInUser,
              role: editedRole,
              roles: [editedRole],
              permissions: editedPermissions,
            };
            Cookies.set("simkap_user", JSON.stringify(newSessionUser), { expires: 7 });
            if (typeof window !== "undefined") {
              localStorage.setItem("simkap_user", JSON.stringify(newSessionUser));
            }
          }
        } catch {
          // ignore
        }
      }

      auditLogService.logActivity(
        user?.name,
        "SPATIE_RBAC_UPDATED",
        "App\\Models\\User",
        `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) memperbarui Hak Akses Spatie RBAC '${selectedUserForRbac.name}': Role (${editedRole}), Permissions [${editedPermissions.join(", ")}]`
      );

      setToast({
        type: "success",
        message: `Hak akses Spatie RBAC '${selectedUserForRbac.name}' berhasil diperbarui!`,
      });
      setSelectedUserForRbac(null);
    } catch {
      setToast({
        type: "error",
        message: `Gagal memperbarui role Spatie RBAC.`,
      });
    }
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    try {
      const created = await userService.create({
        name: newName,
        email: newEmail,
        role: newRole,
        roles: [newRole],
        status: "ACTIVE",
        permissions: newRole === "ADMIN" ? ["*"] : newRole === "MANAGER" ? ["tasks.create", "tasks.review"] : ["tasks.submit", "tasks.create"],
      });

      setUsers((prev) => [created, ...prev.filter((u) => u.id !== created.id)]);
      setIsCreateOpen(false);
      setNewName("");
      setNewEmail("");
      auditLogService.logActivity(
        user?.name,
        "USER_CREATED",
        "App\\Models\\User",
        `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) menambahkan pengguna baru '${newName}' (${newRole})`
      );
      setToast({
        type: "success",
        message: `User baru '${newName}' (${newRole}) berhasil didaftarkan!`,
      });
    } catch {
      setToast({
        type: "error",
        message: "Gagal mendaftarkan user baru.",
      });
    }
  };

  const handleToggleStatus = async (id: number, name: string, currentStatus?: string) => {
    const isInactive = currentStatus === "INACTIVE";
    const actionText = isInactive ? "mengaktifkan kembali" : "menonaktifkan";
    if (
      confirm(
        `Apakah Anda yakin ingin ${actionText} akun pengguna '${name}'?\n\n${
          !isInactive
            ? "Pengguna yang dinonaktifkan TIDAK BISA LOGIN. Semua tugas milik pengguna ini akan otomatis dialihkan ke status PENDING untuk dipindahkan oleh Manager/Admin."
            : "Pengguna akan dapat kembali melakukan login ke sistem."
        }`
      )
    ) {
      try {
        const updated = await userService.toggleStatus(id);
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        if (selectedUserForRbac && selectedUserForRbac.id === id) {
          setSelectedUserForRbac(updated);
        }
        auditLogService.logActivity(
          user?.name,
          isInactive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
          "App\\Models\\User",
          `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) ${actionText} akun pengguna '${name}'`
        );
        setToast({
          type: "success",
          message: `Akun '${name}' berhasil di-${isInactive ? "aktifkan kembali" : "nonaktifkan"}! ${
            !isInactive ? "Seluruh tugasnya telah diset ke PENDING untuk dipindahkan oleh Manager/Admin." : ""
          }`,
        });
      } catch {
        setToast({
          type: "error",
          message: "Gagal mengubah status akun pengguna.",
        });
      }
    }
  };

  const getRoleBadge = (roleName?: string) => {
    const r = (roleName || "EMPLOYEE").toUpperCase();
    if (r === "ADMIN") {
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-rose-100 text-rose-800 border border-rose-300">
          ADMIN
        </span>
      );
    } else if (r === "MANAGER") {
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-blue-100 text-blue-800 border border-blue-300">
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

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.role || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification Popup */}
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, message: null })}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Pengguna & Hak Akses Central Saga
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Pengaturan akun pengguna, status keaktifan, peran (Role), dan izin khusus Spatie RBAC.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 border border-blue-950"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Sleek Floating Toolbar Search Bar */}
      <div className="flex items-center justify-between gap-3 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email pengguna..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-slate-900 shadow-2xs"
          />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-black shadow-xs shrink-0">
          <Users className="w-3.5 h-3.5 text-blue-300" />
          Total {filteredUsers.length} Users
        </span>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200/80 rounded-2xl">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Memuat data pengguna...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                  <th className="py-4 px-4 border-r border-white/10 w-12 text-center">#</th>
                  <th className="py-4 px-4 border-r border-white/10">INFORMASI USER & STATUS</th>
                  <th className="py-4 px-4 border-r border-white/10">ROLE</th>
                  <th className="py-4 px-4 border-r border-white/10">PERMISSIONS SPESIFIK</th>
                  <th className="py-4 px-4 text-center">AKSI SPATIE RBAC & STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/90 text-xs font-medium text-slate-700">
                {filteredUsers.map((u, idx) => {
                  const isInactive = u.status === "INACTIVE";
                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors ${
                        isInactive ? "bg-rose-50/40 hover:bg-rose-50/70" : "even:bg-slate-50/50 hover:bg-blue-50/40"
                      }`}
                    >
                      <td className="py-4 px-4 text-slate-400 font-bold border-r border-slate-200/60 text-center">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-4 px-4 border-r border-slate-200/60">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full text-white font-black flex items-center justify-center text-xs shrink-0 shadow-2xs ${
                              isInactive ? "bg-slate-500" : "bg-blue-900"
                            }`}
                          >
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`font-extrabold ${isInactive ? "text-slate-500 line-through" : "text-slate-900"}`}>
                                {u.name}
                              </p>
                              {isInactive ? (
                                <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                                  🔴 NON-AKTIF
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                                  🟢 AKTIF
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 border-r border-slate-200/60">{getRoleBadge(u.role || u.roles?.[0])}</td>
                      <td className="py-4 px-4 border-r border-slate-200/60">
                        <div className="flex flex-wrap gap-1">
                          {u.permissions && u.permissions.length > 0 ? (
                            u.permissions.map((p) => (
                              <span
                                key={p}
                                className="px-1.5 py-0.5 text-[9.5px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200/90"
                              >
                                {p}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Izin bawaan role</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openRbacModal(u)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs border border-blue-200/90"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            <span>Edit RBAC & Status</span>
                          </button>
                          {canManageUserStatus && (
                            <button
                              onClick={() => handleToggleStatus(u.id, u.name, u.status)}
                              className={`px-3 py-1.5 font-extrabold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 border shadow-2xs ${
                                isInactive
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-600 hover:text-white"
                                  : "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-600 hover:text-white"
                              }`}
                              title={isInactive ? "Aktifkan User Kembali" : "Nonaktifkan User"}
                            >
                              {isInactive ? <Power className="w-3.5 h-3.5 text-emerald-600" /> : <PowerOff className="w-3.5 h-3.5 text-rose-600" />}
                              <span>{isInactive ? "Aktifkan" : "Nonaktifkan"}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Edit Hak Akses Spatie RBAC & Status User */}
      {selectedUserForRbac && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200/90 shadow-2xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Edit Hak Akses Spatie RBAC & Status
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Pengguna: {selectedUserForRbac.name} ({selectedUserForRbac.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForRbac(null)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Akun Switcher Section */}
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <p className="font-extrabold text-slate-900 text-xs">Status Keaktifan Akun Pengguna</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Pengguna non-aktif dilarang login. Tugas milik pengguna non-aktif otomatis dialihkan ke status PENDING.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleStatus(selectedUserForRbac.id, selectedUserForRbac.name, selectedUserForRbac.status)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black border shadow-2xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  selectedUserForRbac.status === "INACTIVE"
                    ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
                    : "bg-rose-600 text-white border-rose-700 hover:bg-rose-700"
                }`}
              >
                {selectedUserForRbac.status === "INACTIVE" ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                <span>{selectedUserForRbac.status === "INACTIVE" ? "🔴 Set AKTIF" : "🟢 Set NON-AKTIF"}</span>
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-800 mb-2">Role Utama Pengguna:</label>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-4 py-2.5 rounded-xl text-xs font-black border shadow-2xs ${
                      editedRole === "ADMIN"
                        ? "bg-rose-900 text-white border-rose-950"
                        : editedRole === "MANAGER"
                        ? "bg-blue-900 text-white border-blue-950"
                        : "bg-emerald-800 text-white border-emerald-950"
                    }`}
                  >
                    {editedRole === "ADMIN" ? "👑 ADMIN" : editedRole === "MANAGER" ? "💼 MANAGER" : "👤 EMPLOYEE"}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    (Terbatas khusus role {editedRole})
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  Izin Spesifik (Permissions Spatie RBAC):
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(PERMISSIONS_BY_ROLE[editedRole] || []).map((perm) => {
                    const isChecked = editedPermissions.includes(perm.key) || editedPermissions.includes("*");
                    return (
                      <label
                        key={perm.key}
                        onClick={() => handleTogglePermission(perm.key)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? "bg-blue-50/80 border-blue-300 text-blue-900"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className="font-semibold text-xs">{perm.label}</span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-blue-900 border-blue-900 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedUserForRbac(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveRbac}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow-md border border-blue-950 cursor-pointer"
              >
                Simpan Hak Akses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah User Baru */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Daftarkan Pengguna Baru
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Sarah Jenkins"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Email Karyawan:</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="sarah@gmail.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Role Utama Spatie RBAC:</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs font-bold"
                >
                  <option value="EMPLOYEE">EMPLOYEE (Karyawan)</option>
                  <option value="MANAGER">MANAGER (Atasan)</option>
                  <option value="ADMIN">ADMIN (Super Admin)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md border border-blue-950 cursor-pointer"
                >
                  Daftarkan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
