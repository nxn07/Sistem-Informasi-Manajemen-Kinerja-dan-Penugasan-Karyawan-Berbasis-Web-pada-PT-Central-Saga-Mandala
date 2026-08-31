"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/user-service";
import { taskService } from "@/services/task-service";
import { User, Task } from "@/types/api";
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
  Crown,
  Lock,
  UserCheck,
  ArrowRightLeft,
  FileText,
  Calendar,
  CheckCircle2,
  ChevronRight,
  UserX,
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
  const isManager = rawRole === "MANAGER";
  const userPerms = user?.permissions || [];
  const canManageUserStatus = isAdmin || isManager || userPerms.includes("users.delete") || userPerms.includes("*");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal Control States
  const [selectedUserForRbac, setSelectedUserForRbac] = useState<User | null>(null);
  const [editedRole, setEditedRole] = useState<string>("EMPLOYEE");
  const [editedPermissions, setEditedPermissions] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Deactivate & Task Reassignment Modal States
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);
  const [targetUserTasks, setTargetUserTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [selectedReplacementUserId, setSelectedReplacementUserId] = useState<number | "">("");
  const [isProcessingDeactivation, setIsProcessingDeactivation] = useState(false);

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

  const fetchTasksForUser = async (targetUser: User): Promise<Task[]> => {
    let allTasks: Task[] = [];
    try {
      allTasks = await taskService.getAll();
    } catch {
      allTasks = [];
    }

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("simkap_created_tasks");
        if (raw) {
          const localTasks: Task[] = JSON.parse(raw);
          const map = new Map<number, Task>();
          localTasks.forEach((t) => map.set(t.id, t));
          allTasks.forEach((t) => {
            if (!map.has(t.id)) map.set(t.id, t);
          });
          allTasks = Array.from(map.values());
        }
      } catch {
        // ignore
      }
    }

    const cleanName = targetUser.name.toLowerCase().trim();
    return allTasks.filter((t) => {
      if ((t as any).is_deleted) return false;
      const empId = t.assigned_employee_id || t.employee?.id || t.employee?.user_id;
      const empName = (t.employee?.full_name || t.employee?.name || (t as any).assignedTo || "").toLowerCase().trim();
      return empId === targetUser.id || (cleanName && empName.includes(cleanName));
    });
  };

  const openRbacModal = (userItem: User) => {
    const isPrimary = userItem.is_primary_admin || userItem.email?.toLowerCase().trim() === "admin@gmail.com";
    if (isPrimary) {
      setToast({
        type: "error",
        message: "Akun Super Admin Utama (Master) dilindungi sistem dan tidak dapat diubah hak aksesnya.",
      });
      return;
    }

    const isCurrentUser = Boolean(
      user && (userItem.id === user.id || (userItem.email && user.email && userItem.email.toLowerCase().trim() === user.email.toLowerCase().trim()))
    );
    if (isCurrentUser) {
      setToast({
        type: "error",
        message: "Anda tidak dapat mengubah hak akses atau peran akun Anda sendiri demi keamanan sistem.",
      });
      return;
    }

    const isInactive = userItem.status === "INACTIVE";
    if (isInactive) {
      setToast({
        type: "error",
        message: `Akun '${userItem.name}' sedang NON-AKTIF. Silakan aktifkan kembali akun ini terlebih dahulu untuk dapat mengedit Role & Hak Akses Spatie RBAC.`,
      });
      return;
    }

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
      const updatedUser: User = {
        ...selectedUserForRbac,
        role: editedRole,
        roles: [editedRole],
        permissions: editedPermissions,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(`simkap_user_perm_${cleanEmail}`, JSON.stringify(editedPermissions));
        localStorage.setItem(`simkap_user_role_${cleanEmail}`, editedRole);
      }

      await userService.update(selectedUserForRbac.id, {
        role: editedRole,
        permissions: editedPermissions,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUserForRbac.id
            ? {
                ...u,
                role: editedRole,
                roles: [editedRole],
                permissions: editedPermissions,
              }
            : u
        )
      );

      const targetUserName = selectedUserForRbac.name;
      auditLogService.logActivity(
        user?.name,
        "SPATIE_RBAC_UPDATED",
        "App\\Models\\User",
        `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) memperbarui Role menjadi '${editedRole}' dan permissions '${editedPermissions.join(", ")}' untuk pengguna '${targetUserName}'`
      );

      setSelectedUserForRbac(null);
      setToast({
        type: "success",
        message: `Hak akses Spatie RBAC untuk '${targetUserName}' berhasil diperbarui ke Role ${editedRole}!`,
      });
    } catch {
      setToast({
        type: "error",
        message: "Gagal memperbarui hak akses pengguna.",
      });
    }
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      setToast({
        type: "error",
        message: "Nama dan Email wajib diisi!",
      });
      return;
    }

    try {
      const roleToAssign = isManager ? "EMPLOYEE" : newRole;
      const defaultPerms =
        roleToAssign === "ADMIN"
          ? ["*"]
          : roleToAssign === "MANAGER"
          ? ["tasks.create", "tasks.submit", "tasks.review"]
          : ["tasks.submit"];

      const created = await userService.create({
        name: newName,
        email: newEmail,
        role: roleToAssign,
        roles: [roleToAssign],
        status: "ACTIVE",
        permissions: defaultPerms,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(`simkap_user_perm_${newEmail.toLowerCase().trim()}`, JSON.stringify(defaultPerms));
        localStorage.setItem(`simkap_user_status_${newEmail.toLowerCase().trim()}`, "ACTIVE");
      }

      setUsers((prev) => [created, ...prev]);
      setIsCreateOpen(false);
      setNewName("");
      setNewEmail("");
      setNewRole("EMPLOYEE");

      auditLogService.logActivity(
        user?.name,
        "USER_CREATED",
        "App\\Models\\User",
        `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) menambahkan pengguna baru '${newName}' (${roleToAssign})`
      );
      setToast({
        type: "success",
        message: `User baru '${newName}' (${roleToAssign}) berhasil didaftarkan!`,
      });
    } catch {
      setToast({
        type: "error",
        message: "Gagal mendaftarkan user baru.",
      });
    }
  };

  const handleToggleStatus = async (id: number, name: string, currentStatus?: string) => {
    const isCurrentUser = Boolean(
      user && (id === user.id || (name && user.name && name.toLowerCase().trim() === user.name.toLowerCase().trim()))
    );
    if (isCurrentUser) {
      setToast({
        type: "error",
        message: "Anda tidak dapat menonaktifkan akun Anda sendiri yang sedang aktif!",
      });
      return;
    }

    const isInactive = currentStatus === "INACTIVE";

    // JIKA MAU MENGAKTIFKAN KEMBALI:
    if (isInactive) {
      try {
        const updated = await userService.toggleStatus(id);
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        if (selectedUserForRbac && selectedUserForRbac.id === id) {
          setSelectedUserForRbac(updated);
        }
        auditLogService.logActivity(
          user?.name,
          "USER_ACTIVATED",
          "App\\Models\\User",
          `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) mengaktifkan kembali akun pengguna '${name}'`
        );
        setToast({
          type: "success",
          message: `Akun '${name}' berhasil diaktifkan kembali! Pengguna kini dapat login kembali.`,
        });
      } catch {
        setToast({
          type: "error",
          message: "Gagal mengaktifkan kembali akun pengguna.",
        });
      }
      return;
    }

    // JIKA MAU MENONAKTIFKAN: Buka Modal Khusus dengan List Tugas & Pilihan Reassign!
    const targetUserObj: User = users.find((u) => u.id === id) || {
      id,
      name,
      email: "",
      role: "EMPLOYEE",
      roles: ["EMPLOYEE"],
      permissions: ["tasks.submit"],
      status: "ACTIVE",
      created_at: new Date().toISOString(),
    };
    setDeactivateTarget(targetUserObj);
    setLoadingTasks(true);
    try {
      const tasksFound = await fetchTasksForUser(targetUserObj);
      setTargetUserTasks(tasksFound);
      const availableEmployees = users.filter(
        (u) =>
          u.id !== id &&
          u.status !== "INACTIVE" &&
          (u.role || u.roles?.[0] || "EMPLOYEE").toUpperCase() === "EMPLOYEE"
      );
      if (availableEmployees.length > 0) {
        setSelectedReplacementUserId(availableEmployees[0].id);
      } else {
        setSelectedReplacementUserId("");
      }
    } catch {
      setTargetUserTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleConfirmDeactivation = async (reassign: boolean) => {
    if (!deactivateTarget) return;
    setIsProcessingDeactivation(true);
    try {
      const replacementUser =
        reassign && selectedReplacementUserId
          ? users.find((u) => u.id === Number(selectedReplacementUserId))
          : null;

      const nowFormatted = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB";

      // 1. Update tasks in localStorage
      if (typeof window !== "undefined" && targetUserTasks.length > 0) {
        const raw = localStorage.getItem("simkap_created_tasks");
        let allCreated: Task[] = raw ? JSON.parse(raw) : [];
        if (allCreated.length === 0) {
          try {
            allCreated = await taskService.getAll();
          } catch {
            allCreated = [];
          }
        }

        const taskIdsToUpdate = new Set(targetUserTasks.map((t) => t.id));

        allCreated = allCreated.map((t) => {
          if (taskIdsToUpdate.has(t.id)) {
            if (replacementUser) {
              return {
                ...t,
                assignedTo: replacementUser.name,
                assigned_employee_id: replacementUser.id,
                employee: {
                  id: replacementUser.id,
                  user_id: replacementUser.id,
                  division_id: 1,
                  nip: "EMP-" + replacementUser.id,
                  name: replacementUser.name,
                  full_name: replacementUser.name,
                  position: replacementUser.role || "EMPLOYEE",
                },
                status: t.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
                needs_reassignment: false,
                reassigned_by: user?.name || "Manager",
                reassigned_at: nowFormatted,
                previous_assignee: deactivateTarget.name,
                updated_at: nowFormatted,
              };
            } else {
              return {
                ...t,
                status: "PENDING",
                needs_reassignment: true,
                updated_at: nowFormatted,
              };
            }
          }
          return t;
        });

        localStorage.setItem("simkap_created_tasks", JSON.stringify(allCreated));

        // Update simkap_tasks_v2 for backward compatibility
        const rawV2 = localStorage.getItem("simkap_tasks_v2");
        if (rawV2) {
          const listV2 = JSON.parse(rawV2);
          const updatedV2 = listV2.map((t: any) => {
            if (taskIdsToUpdate.has(t.id)) {
              return replacementUser
                ? {
                    ...t,
                    assignedTo: replacementUser.name,
                    assigned_employee_id: replacementUser.id,
                    employee: {
                      ...t.employee,
                      name: replacementUser.name,
                      full_name: replacementUser.name,
                    },
                    status: "IN_PROGRESS",
                    needs_reassignment: false,
                    reassigned_by: user?.name || "Manager",
                    reassigned_at: nowFormatted,
                    previous_assignee: deactivateTarget.name,
                    updated_at: nowFormatted,
                  }
                : { ...t, status: "PENDING", needs_reassignment: true, updated_at: nowFormatted };
            }
            return t;
          });
          localStorage.setItem("simkap_tasks_v2", JSON.stringify(updatedV2));
        }

        window.dispatchEvent(new Event("simkap_tasks_updated"));
        window.dispatchEvent(new Event("storage"));
      }

      // 2. Deactivate user status
      const updatedUser = await userService.toggleStatus(deactivateTarget.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === deactivateTarget.id ? updatedUser : u))
      );
      if (selectedUserForRbac && selectedUserForRbac.id === deactivateTarget.id) {
        setSelectedUserForRbac(updatedUser);
      }

      // 3. Log audit
      if (replacementUser && targetUserTasks.length > 0) {
        auditLogService.logActivity(
          user?.name,
          "TASK_REASSIGNED",
          "App\\Models\\Task",
          `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) menonaktifkan akun '${deactivateTarget.name}' dan memindahkan ${targetUserTasks.length} tugas ke '${replacementUser.name}'`
        );
        setToast({
          type: "success",
          message: `Akun '${deactivateTarget.name}' dinonaktifkan & ${targetUserTasks.length} tugas berhasil dialihkan ke '${replacementUser.name}'!`,
        });
      } else {
        auditLogService.logActivity(
          user?.name,
          "USER_DEACTIVATED",
          "App\\Models\\User",
          `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) menonaktifkan akun pengguna '${deactivateTarget.name}'`
        );
        setToast({
          type: "success",
          message: `Akun '${deactivateTarget.name}' berhasil dinonaktifkan! ${
            targetUserTasks.length > 0
              ? "Seluruh tugas telah diset ke status PENDING untuk dialihkan nanti."
              : ""
          }`,
        });
      }

      setDeactivateTarget(null);
      setTargetUserTasks([]);
    } catch {
      setToast({
        type: "error",
        message: "Gagal memproses penonaktifan akun pengguna.",
      });
    } finally {
      setIsProcessingDeactivation(false);
    }
  };

  const getRoleBadge = (roleName?: string, isPrimaryAdmin?: boolean) => {
    const r = (roleName || "EMPLOYEE").toUpperCase();
    if (isPrimaryAdmin) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-black rounded-full bg-linear-to-r from-amber-100 via-amber-200 to-yellow-100 text-amber-900 border border-amber-400 shadow-2xs">
          <Crown className="w-3 h-3 text-amber-700 shrink-0" />
          <span>SUPER ADMIN</span>
        </span>
      );
    } else if (r === "ADMIN") {
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

  const filteredUsers = users
    .filter((u) => {
      // Jika login sebagai Manager, HANYA tampilkan akun bawahan (EMPLOYEE)
      if (isManager) {
        const uRole = (u.role || u.roles?.[0] || "EMPLOYEE").toUpperCase();
        if (uRole === "ADMIN" || uRole === "MANAGER" || u.is_primary_admin) {
          return false;
        }
      }
      return (
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.role || "").toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      const getRank = (u: User) => {
        if (u.is_primary_admin || u.email?.toLowerCase().trim() === "admin@gmail.com") return 1; // 👑 Super Admin
        const r = (u.role || u.roles?.[0] || "EMPLOYEE").toUpperCase();
        if (r === "ADMIN") return 2; // 🛡️ Admin Sekunder
        if (r === "MANAGER") return 3; // 👔 Manager
        return 4; // 👤 Employee
      };

      const rankA = getRank(a);
      const rankB = getRank(b);
      if (rankA !== rankB) return rankA - rankB;

      const statusA = a.status === "INACTIVE" ? 1 : 0;
      const statusB = b.status === "INACTIVE" ? 1 : 0;
      if (statusA !== statusB) return statusA - statusB;

      return a.id - b.id;
    });

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
            {isManager ? "Manajemen Anggota Tim Pegawai" : "Manajemen Pengguna & Hak Akses Central Saga"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {isManager
              ? "Kelola status keaktifan dan delegasi izin penugasan pegawai (Employee)."
              : "Pengaturan akun pengguna, status keaktifan, peran (Role), dan izin khusus Spatie RBAC."}
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 border border-blue-950"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isManager ? "Tambah Pegawai Baru" : "Tambah Pengguna Baru"}</span>
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
            placeholder={isManager ? "Cari nama atau email pegawai..." : "Cari nama atau email pengguna..."}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-slate-900 shadow-2xs"
          />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-black shadow-xs shrink-0">
          <Users className="w-3.5 h-3.5 text-blue-300" />
          Total {filteredUsers.length} {isManager ? "Pegawai" : "Users"}
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
                  const isPrimary = u.is_primary_admin || u.email?.toLowerCase().trim() === "admin@gmail.com";
                  const isCurrentUser = Boolean(
                    user && (u.id === user.id || (u.email && user.email && u.email.toLowerCase().trim() === user.email.toLowerCase().trim()))
                  );
                  const isInactive = !isPrimary && u.status === "INACTIVE";
                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors ${
                        isPrimary
                          ? "bg-amber-50/40 hover:bg-amber-50/70"
                          : isCurrentUser
                          ? "bg-blue-50/40 hover:bg-blue-50/70 border-l-4 border-l-blue-600"
                          : isInactive
                          ? "bg-rose-50/40 hover:bg-rose-50/70"
                          : "even:bg-slate-50/50 hover:bg-blue-50/40"
                      }`}
                    >
                      <td className="py-4 px-4 text-slate-400 font-bold border-r border-slate-200/60 text-center">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-4 px-4 border-r border-slate-200/60">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full text-white font-black flex items-center justify-center text-xs shrink-0 shadow-2xs ${
                              isPrimary
                                ? "bg-amber-600 ring-2 ring-amber-300"
                                : isCurrentUser
                                ? "bg-blue-600 ring-2 ring-blue-400"
                                : isInactive
                                ? "bg-slate-500"
                                : "bg-blue-900"
                            }`}
                          >
                            {isPrimary ? (
                              <Crown className="w-4 h-4 text-amber-100" />
                            ) : isCurrentUser ? (
                              <UserCheck className="w-4 h-4 text-white" />
                            ) : (
                              u.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-extrabold ${isInactive ? "text-slate-500 line-through" : "text-slate-900"}`}>
                                {u.name}
                              </p>
                              {isCurrentUser && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black rounded-full bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs">
                                  <UserCheck className="w-2.5 h-2.5 text-blue-700" />
                                  AKUN ANDA
                                </span>
                              )}
                              {isPrimary ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black rounded-full bg-amber-100 text-amber-900 border border-amber-400 shadow-2xs">
                                  👑 MASTER
                                </span>
                              ) : isInactive ? (
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
                      <td className="py-4 px-4 border-r border-slate-200/60">{getRoleBadge(u.role || u.roles?.[0], isPrimary)}</td>
                      <td className="py-4 px-4 border-r border-slate-200/60">
                        <div className="flex flex-wrap gap-1">
                          {isPrimary ? (
                            <span className="px-2 py-0.5 text-[9.5px] font-black rounded bg-amber-100/90 text-amber-900 border border-amber-300">
                              * (Akses Penuh Super Admin)
                            </span>
                          ) : u.permissions && u.permissions.length > 0 ? (
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
                        {isPrimary ? (
                          <div className="flex items-center justify-center">
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs cursor-not-allowed select-none"
                              title="Akun Super Admin Utama dilindungi sistem dan tidak dapat diedit atau dinonaktifkan"
                            >
                              <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Terkunci (Master)</span>
                            </span>
                          </div>
                        ) : isCurrentUser ? (
                          <div className="flex items-center justify-center">
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-xl text-xs font-bold border border-blue-200 shadow-2xs cursor-not-allowed select-none"
                              title="Anda sedang login dengan akun ini. Anda tidak dapat mengubah peran atau menonaktifkan akun sendiri."
                            >
                              <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>Akun Anda (Terkunci)</span>
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openRbacModal(u)}
                              disabled={isInactive}
                              className={`px-3 py-1.5 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1 shadow-2xs border ${
                                isInactive
                                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60 select-none"
                                  : "bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold border-blue-200/90 cursor-pointer"
                              }`}
                              title={
                                isInactive
                                  ? "Akun pengguna ini sedang NON-AKTIF. Aktifkan akun terlebih dahulu untuk mengedit hak akses Spatie RBAC & Status."
                                  : "Edit hak akses Spatie RBAC & status pengguna"
                              }
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
                        )}
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
                  {!isManager && (
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        type="button"
                        onClick={() => handleRolePillClick("EMPLOYEE")}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          editedRole === "EMPLOYEE"
                            ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        Set Employee
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRolePillClick("MANAGER")}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          editedRole === "MANAGER"
                            ? "bg-blue-100 text-blue-900 border-blue-300"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        Set Manager
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRolePillClick("ADMIN")}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          editedRole === "ADMIN"
                            ? "bg-rose-100 text-rose-900 border-rose-300"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        Set Admin
                      </button>
                    </div>
                  )}
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
                {isManager ? "Daftarkan Anggota Tim Pegawai" : "Daftarkan Pengguna Baru"}
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
                  disabled={isManager}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs font-bold disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="EMPLOYEE">EMPLOYEE (Karyawan)</option>
                  {!isManager && <option value="MANAGER">MANAGER (Atasan)</option>}
                  {!isManager && <option value="ADMIN">ADMIN (Super Admin)</option>}
                </select>
                {isManager && (
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    * Sebagai Manager, Anda hanya memiliki wewenang untuk mendaftarkan akun staf/pegawai (Employee).
                  </p>
                )}
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
                  {isManager ? "Daftarkan Pegawai" : "Daftarkan User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nonaktifkan Akun & Reassign Tugas Pegawai */}
      {deactivateTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-200 shadow-2xs">
                  <UserX className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Nonaktifkan Akun & Pengalihan Tugas
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Pegawai: <strong className="text-slate-700">{deactivateTarget.name}</strong> ({deactivateTarget.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDeactivateTarget(null);
                  setTargetUserTasks([]);
                }}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Banner */}
            <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900 leading-relaxed font-medium">
                <span className="font-bold">Perhatian:</span> Akun <span className="font-bold">{deactivateTarget.name}</span> akan dinonaktifkan (<span className="font-black text-rose-700">🔴 NON-AKTIF</span>) dan akses login akan langsung diblokir.
              </div>
            </div>

            {/* Tasks List Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Daftar Tugas Yang Sedang Dikerjakan ({targetUserTasks.length}):</span>
                </label>
                {targetUserTasks.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                    Memerlukan Pengalihan
                  </span>
                )}
              </div>

              {loadingTasks ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-2 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <p className="text-xs text-slate-500 font-semibold">Memeriksa tugas pegawai...</p>
                </div>
              ) : targetUserTasks.length > 0 ? (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {targetUserTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 truncate">{t.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10.5px] text-slate-500 flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {t.due_date || t.deadline || "Tanpa Deadline"}
                          </span>
                          <span>•</span>
                          <span>Bobot: <strong>{t.weight || t.weight_score || 5} Poin</strong></span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded-full uppercase border shrink-0 ${
                        t.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : t.status === "SUBMITTED"
                          ? "bg-purple-100 text-purple-800 border-purple-300"
                          : t.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}>
                        {t.status || "PENDING"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-center text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  Pegawai ini saat ini tidak memiliki tugas yang sedang berjalan.
                </div>
              )}
            </div>

            {/* Target Replacement Employee Picker (Only if tasks exist) */}
            {targetUserTasks.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pindahkan Seluruh Tugas ({targetUserTasks.length}) ke Pegawai Pengganti:</span>
                </label>
                <select
                  value={selectedReplacementUserId}
                  onChange={(e) => setSelectedReplacementUserId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-3 py-2.5 bg-blue-50/50 border border-blue-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {users
                    .filter(
                      (u) =>
                        u.id !== deactivateTarget.id &&
                        u.status !== "INACTIVE" &&
                        (u.role || u.roles?.[0] || "EMPLOYEE").toUpperCase() === "EMPLOYEE"
                    )
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email}) - {u.role || "EMPLOYEE"}
                      </option>
                    ))}
                </select>
                <p className="text-[10.5px] text-slate-500 font-medium">
                  * Tugas yang dialihkan akan langsung muncul di halaman tugas milik pegawai terpilih secara instan.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                disabled={isProcessingDeactivation}
                onClick={() => {
                  setDeactivateTarget(null);
                  setTargetUserTasks([]);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 cursor-pointer"
              >
                Batal
              </button>

              {targetUserTasks.length > 0 ? (
                <>
                  <button
                    type="button"
                    disabled={isProcessingDeactivation}
                    onClick={() => handleConfirmDeactivation(false)}
                    className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-100 hover:bg-rose-50 text-rose-700 hover:text-rose-800 text-xs font-extrabold rounded-xl border border-rose-300 cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <PowerOff className="w-3.5 h-3.5" />
                    <span>Nonaktifkan Saja (Pending)</span>
                  </button>
                  <button
                    type="button"
                    disabled={isProcessingDeactivation || !selectedReplacementUserId}
                    onClick={() => handleConfirmDeactivation(true)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-linear-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white text-xs font-black rounded-xl shadow-md border border-blue-950 cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isProcessingDeactivation ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    )}
                    <span>Nonaktifkan & Pindahkan Tugas</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={isProcessingDeactivation}
                  onClick={() => handleConfirmDeactivation(false)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md border border-rose-700 cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  {isProcessingDeactivation ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <PowerOff className="w-3.5 h-3.5" />
                  )}
                  <span>Nonaktifkan Akun</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
