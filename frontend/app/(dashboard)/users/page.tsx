"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/user-service";
import { User } from "@/types/api";
import { Toast } from "@/components/ui/Toast";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";
import {
  Search,
  Shield,
  Loader2,
  Check,
  X,
  UserPlus,
  Key,
  Users,
  Trash2,
  Lock,
} from "lucide-react";

export default function UsersPage() {
  const { user } = useAuth();
  const rawRole = (user?.role || user?.roles?.[0] || "ADMIN").toUpperCase();
  const isAdmin = rawRole === "ADMIN";
  const canDeleteUser = isAdmin || (user?.permissions?.includes("users.delete") ?? false);
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
    setEditedRole(userItem.role || userItem.roles?.[0] || "EMPLOYEE");
    
    let currentPerms = userItem.permissions;
    if (typeof window !== "undefined") {
      try {
        const rawByEmail = localStorage.getItem(`simkap_user_perm_${userItem.email.toLowerCase()}`);
        const rawById = localStorage.getItem(`simkap_user_perm_${userItem.id}`);
        const raw = rawByEmail || rawById;
        if (raw) currentPerms = JSON.parse(raw);
      } catch {
        // ignore
      }
    }
    setEditedPermissions(currentPerms || ["tasks.submit"]);
  };

  const handleTogglePermission = (permissionKey: string) => {
    setEditedPermissions((prev) =>
      prev.includes(permissionKey)
        ? prev.filter((p) => p !== permissionKey)
        : [...prev, permissionKey]
    );
  };

  const handleSaveRbac = async () => {
    if (!selectedUserForRbac) return;

    try {
      const updatedUser = await userService.update(selectedUserForRbac.id, {
        role: editedRole,
        roles: [editedRole],
        permissions: editedPermissions,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(`simkap_user_perm_${selectedUserForRbac.email.toLowerCase()}`, JSON.stringify(editedPermissions));
        localStorage.setItem(`simkap_user_perm_${selectedUserForRbac.id}`, JSON.stringify(editedPermissions));
      }

      // Update current logged in user cookie & localStorage if editing logged-in user
      const currentUserCookie = Cookies.get("simkap_user");
      if (currentUserCookie) {
        try {
          const parsed = JSON.parse(currentUserCookie);
          if (parsed.email?.toLowerCase() === selectedUserForRbac.email?.toLowerCase() || parsed.id === selectedUserForRbac.id) {
            const merged = { ...parsed, role: editedRole, roles: [editedRole], permissions: editedPermissions };
            Cookies.set("simkap_user", JSON.stringify(merged), { expires: 7 });
            if (typeof window !== "undefined") {
              localStorage.setItem("simkap_user", JSON.stringify(merged));
            }
          }
        } catch {
          // ignore
        }
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUserForRbac.id || u.email.toLowerCase() === selectedUserForRbac.email.toLowerCase()
            ? { ...u, role: editedRole, roles: [editedRole], permissions: editedPermissions }
            : u
        )
      );

      setSelectedUserForRbac(null);
      setToast({
        type: "success",
        message: `Hak Akses & Role (${editedRole}) Berhasil Diperbarui untuk ${selectedUserForRbac.name}! (Izin: ${editedPermissions.length > 0 ? editedPermissions.join(", ") : "Tanpa Izin Khusus"})`,
      });
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
        permissions: newRole === "ADMIN" ? ["*"] : newRole === "MANAGER" ? ["tasks.create", "tasks.review"] : ["tasks.submit", "tasks.create"],
      });

      setUsers((prev) => [created, ...prev.filter((u) => u.id !== created.id)]);
      setIsCreateOpen(false);
      setNewName("");
      setNewEmail("");
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

  const handleDeleteUser = async (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna '${name}' dari sistem?`)) {
      try {
        await userService.delete(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setToast({
          type: "success",
          message: `Pengguna/Karyawan '${name}' berhasil dihapus dari sistem!`,
        });
      } catch (error: any) {
        console.error("Gagal menghapus pengguna dari sistem:", error);
        const errMsg = error?.response?.data?.message || "Gagal menghapus pengguna dari sistem. Silakan coba lagi.";
        setToast({
          type: "error",
          message: errMsg,
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
            Pengaturan akun pengguna, peran (Role), dan izin khusus Spatie RBAC.
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

      {/* Sleek Floating Toolbar Search Bar (Clean Single Frame Without Double Borders) */}
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

      {/* Users Table (ORIGINAL APPROVED SLEEK DESIGN) */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200/80 rounded-2xl">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Memuat data pengguna...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-300 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                  <th className="py-4 px-4 w-12 border-r border-white/10 text-center">NO.</th>
                  <th className="py-4 px-4 border-r border-white/10">PENGGUNA</th>
                  <th className="py-4 px-4 border-r border-white/10">ROLE</th>
                  <th className="py-4 px-4 border-r border-white/10">PERMISSIONS SPESIFIK</th>
                  <th className="py-4 px-4 text-center">AKSI SPATIE RBAC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/90 text-xs font-medium text-slate-700">
                {filteredUsers.map((u, idx) => (
                  <tr key={u.id} className="even:bg-slate-50/50 hover:bg-blue-50/40 transition-colors">
                    <td className="py-4 px-4 text-slate-400 font-bold border-r border-slate-200/60 text-center">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-4 px-4 border-r border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-2xs">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 border-r border-slate-200/60">{getRoleBadge(u.role || u.roles?.[0])}</td>
                    <td className="py-4 px-4 border-r border-slate-200/60">
                      <div className="flex flex-wrap gap-1">
                        {(u.permissions && u.permissions.length > 0) ? (
                          u.permissions.map((p) => (
                            <span key={p} className="px-1.5 py-0.5 text-[9.5px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200/90">
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
                          <span>Edit Hak Akses</span>
                        </button>
                        {canDeleteUser && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-slate-200 hover:border-rose-300"
                            title="Hapus Pengguna / Karyawan"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Edit Hak Akses Spatie RBAC */}
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
                    Edit Hak Akses Spatie RBAC
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Pengguna: {selectedUserForRbac.name} ({selectedUserForRbac.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForRbac(null)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-800 mb-2">Pilih Role Utama:</label>
                <div className="grid grid-cols-3 gap-2">
                  {["ADMIN", "MANAGER", "EMPLOYEE"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setEditedRole(r)}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                        editedRole === r
                          ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-2 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  Izin Akses Spesifik (Permissions):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "tasks.create", label: "tasks.create (Buat Tugas)" },
                    { key: "tasks.submit", label: "tasks.submit (Submit Bukti)" },
                    { key: "tasks.review", label: "tasks.review (Review Atasan)" },
                    { key: "users.manage", label: "users.manage (Kelola User)" },
                    { key: "users.delete", label: "users.delete (Hapus Karyawan)" },
                    { key: "evaluations.create", label: "evaluations.create (Evaluasi)" },
                    { key: "divisions.manage", label: "divisions.manage (Divisi)" },
                  ].map((perm) => {
                    const isChecked = editedPermissions.includes(perm.key);
                    return (
                      <button
                        key={perm.key}
                        type="button"
                        onClick={() => handleTogglePermission(perm.key)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                          isChecked
                            ? "bg-blue-50/80 border-blue-400 text-blue-900 font-bold"
                            : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate pr-1">{perm.label}</span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-white border-slate-300"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedUserForRbac(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveRbac}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow-md border border-blue-950"
              >
                Simpan Hak Akses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Pengguna Baru */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Tambah Pengguna Baru</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Misal: Sarah Jenkins"
                  className="w-full px-3 py-2 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="sarah@gmail.com"
                  className="w-full px-3 py-2 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Utama *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200/80 rounded-xl font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
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
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md border border-blue-950"
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
